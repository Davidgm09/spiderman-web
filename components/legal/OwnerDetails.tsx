import { CONTACT_EMAIL, LEGAL_OWNER } from "@/lib/config"

// Datos identificativos del titular; solo se muestran los campos rellenados en lib/config.ts
export function OwnerDetails() {
  const rows = [
    { label: "Titular", value: LEGAL_OWNER.name },
    { label: "NIF", value: LEGAL_OWNER.nif },
    { label: "Domicilio", value: LEGAL_OWNER.address },
    { label: "Email", value: CONTACT_EMAIL },
  ].filter((row) => row.value)

  return (
    <ul className="mt-4 space-y-1">
      {rows.map(({ label, value }) => (
        <li key={label}>
          <strong className="text-white">{label}:</strong> {value}
        </li>
      ))}
    </ul>
  )
}
