# Earth Texture License Requirements

## Minimum Metadata

Every Earth texture entry must include:

- `id`: stable registry id
- `file`: local file name under `public/assets/textures/earth/`
- `type`: day, night, cloud, elevation, or composite
- `status`: missing, approved, disabled, or rejected
- `source`: original source page or asset authority
- `license`: explicit license name or signed permission reference
- `author`: creator or institution
- `usageNotes`: allowed product use and restrictions
- `approvedBy`: internal approver
- `dateAdded`: ISO date
- `checksum`: checksum of the exact committed file
- `enabled`: false unless explicitly approved for product rendering

## Rejection Rules

Disable or reject a texture if:

- source is empty
- license is empty or unclear
- author is unknown
- approver is missing
- checksum is missing
- file path is remote, absolute, parent-directory, or outside the governed folder
- enabled is true without approved metadata

## Legal Rule

No generated image asset, random image, Google image result, unknown-license texture, or external hotlinked image can enter the product identity.

