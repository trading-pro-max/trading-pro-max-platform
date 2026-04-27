# Earth Texture Asset Policy

## Policy

Earth texture assets are disabled unless they are present in the governed manifest and include complete approval metadata. A file alone is not enough to activate a texture.

## Allowed Asset Path

Approved Earth texture files may only live under:

`public/assets/textures/earth/`

No renderer may hotlink a remote texture URL. The product may only reference local public assets after the manifest marks them approved and enabled.

## Approval Requirements

An approved texture entry must include:

- a local file name with a safe image extension
- source
- license
- author
- usage notes
- approvedBy
- dateAdded
- checksum
- enabled true

Any missing or invalid field disables the texture and returns the renderer to procedural fallback.

## Public Boundary

Users should not see license warnings, approval status, or internal registry detail. Public UI can say the Earth visual is using a local fallback or Earth-native visual identity. Founder-only surfaces may show readiness and missing metadata.

## Current Default

The manifest contains no active texture by default. Procedural fallback is the active Earth.

