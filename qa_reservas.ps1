$ProgressPreference = 'SilentlyContinue'
$base = 'http://localhost:3000/api'
$email = "qa_$(Get-Date -Format 'yyyyMMddHHmmss')@test.com"
$pass = 'Test12345'
$headersJson = @{ 'Content-Type' = 'application/json' }

function Invoke-Api {
  param(
    [string]$Method,
    [string]$Url,
    [object]$Body,
    [hashtable]$Headers
  )

  try {
    if ($null -ne $Body) {
      $json = ($Body | ConvertTo-Json -Depth 10)
    }

    if ($Method -eq 'GET') {
      $resp = Invoke-RestMethod -Method Get -Uri $Url -Headers $Headers
      return @{ ok = $true; status = 200; data = $resp }
    }

    $resp = Invoke-RestMethod -Method $Method -Uri $Url -Headers $Headers -Body $json
    return @{ ok = $true; status = 200; data = $resp }
  } catch {
    $status = 0
    $detail = $null

    if ($_.Exception.Response) {
      $status = [int]$_.Exception.Response.StatusCode
      try {
        $stream = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($stream)
        $detail = $reader.ReadToEnd()
      } catch {}
    }

    return @{ ok = $false; status = $status; error = $_.Exception.Message; detail = $detail }
  }
}

Write-Output '--- QA Reserva: inicio ---'

$registro = Invoke-Api -Method 'POST' -Url "$base/usuarios" -Body @{ nombre = 'QA'; apellido = 'Reserva'; email = $email; password = $pass; rol = 'usuario' } -Headers $headersJson
Write-Output "registro_ok=$($registro.ok) status=$($registro.status)"

$login = Invoke-Api -Method 'POST' -Url "$base/usuarios/login" -Body @{ email = $email; password = $pass } -Headers $headersJson
if (-not $login.ok) {
  Write-Output "login_fallo status=$($login.status) detalle=$($login.detail)"
  exit 1
}

$token = $login.data.token
$authHeaders = @{ 'Content-Type' = 'application/json'; 'Authorization' = "Bearer $token" }
Write-Output "login_ok token_len=$($token.Length)"

$lista = Invoke-Api -Method 'GET' -Url "$base/complejos?page=1&limit=50" -Body $null -Headers @{}
if (-not $lista.ok) {
  Write-Output 'complejos_fallo'
  exit 1
}

$complejos = @($lista.data.complejos)
$targetComplejo = $null
$padelCancha = $null

foreach ($c in $complejos) {
  $canchas = @($c.canchas)
  $p = $canchas | Where-Object { $_.disponible -eq $true -and ($_.tipoCancha -match '(?i)padel') } | Select-Object -First 1
  if ($p) {
    $targetComplejo = $c
    $padelCancha = $p
    break
  }
}

if (-not $targetComplejo) {
  Write-Output 'no_hay_complejo_con_padel_disponible'
  exit 1
}

$fecha = (Get-Date).AddDays(1).ToString('yyyy-MM-dd')
Write-Output "complejo=$($targetComplejo.nombre) canchaPadel=$($padelCancha._id) fecha=$fecha"

$bodyA = @{ complejo = $targetComplejo._id; canchaId = $padelCancha._id; canchaTipo = $padelCancha.tipoCancha; fecha = $fecha; horaInicio = '14:30' }
$rA = Invoke-Api -Method 'POST' -Url "$base/reservas" -Body $bodyA -Headers $authHeaders
Write-Output "reserva_1430_ok=$($rA.ok) status=$($rA.status)"
if (-not $rA.ok) { Write-Output "detalleA=$($rA.detail)" }

$bodyB = @{ complejo = $targetComplejo._id; canchaId = $padelCancha._id; canchaTipo = $padelCancha.tipoCancha; fecha = $fecha; horaInicio = '15:00' }
$rB = Invoke-Api -Method 'POST' -Url "$base/reservas" -Body $bodyB -Headers $authHeaders
Write-Output "reserva_1500_ok=$($rB.ok) status=$($rB.status)"
if (-not $rB.ok) { Write-Output "detalleB=$($rB.detail)" }

$bodyC = @{ complejo = $targetComplejo._id; canchaId = $padelCancha._id; canchaTipo = $padelCancha.tipoCancha; fecha = $fecha; horaInicio = '16:00' }
$rC = Invoke-Api -Method 'POST' -Url "$base/reservas" -Body $bodyC -Headers $authHeaders
Write-Output "reserva_1600_ok=$($rC.ok) status=$($rC.status)"
if (-not $rC.ok) { Write-Output "detalleC=$($rC.detail)" }

$disp = Invoke-Api -Method 'GET' -Url "$base/complejos/$($targetComplejo._id)/disponibilidad?fecha=$fecha&hora=15:00&canchaTipo=Padel" -Body $null -Headers @{ 'Authorization' = "Bearer $token" }
if (-not $disp.ok) {
  Write-Output "disponibilidad_fallo status=$($disp.status) detalle=$($disp.detail)"
  exit 1
}

$ids = @($disp.data.canchasDisponibles)
$estaDisponible = $ids -contains "$($padelCancha._id)"
Write-Output "padel_1500_aparece_disponible=$estaDisponible"

$mis = Invoke-Api -Method 'POST' -Url "$base/reservas/mis-reservas" -Body @{} -Headers @{ 'Authorization' = "Bearer $token" }
if ($mis.ok) {
  $misCount = @($mis.data).Count
  Write-Output "mis_reservas_count=$misCount"
  $primeras = @($mis.data) | Select-Object -First 3
  foreach ($r in $primeras) {
    Write-Output ("reserva -> fecha=" + ([string]$r.fecha) + " horaInicio=" + ([string]$r.horaInicio) + " horaFin=" + ([string]$r.horaFin))
  }
}

$okSolapamiento = ($rA.ok -eq $true) -and ($rB.ok -eq $false -and $rB.status -eq 400) -and ($rC.ok -eq $true)
$okDisp = ($estaDisponible -eq $false)
Write-Output "QA_RESULT solapamiento_ok=$okSolapamiento disponibilidad_ok=$okDisp"
Write-Output '--- QA Reserva: fin ---'

