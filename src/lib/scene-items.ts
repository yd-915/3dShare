import { ColorMaterial, Components } from "@vertexvis/viewer";
import { FrameCamera } from "@vertexvis/viewer/dist/types/lib/types/frameCamera";

interface Req {
  readonly viewer: Components.VertexViewer | null;
}

interface SelectByHitReq extends Req {
  readonly color?: string;
  readonly deselectItemId?: string;
  readonly selectItemId?: string;
}

interface UpdateCameraReq extends Req {
  readonly camera: Partial<FrameCamera>;
}

export function createSelectColor(hex: string): ColorMaterial.ColorMaterial {
  return {
    ...ColorMaterial.fromHex(hex),
    glossiness: 4,
    specular: { r: 255, g: 255, b: 255, a: 0 },
  };
}

export async function selectByItemId({
  color = "#ffff00",
  deselectItemId,
  selectItemId,
  viewer,
}: SelectByHitReq): Promise<void> {
  if (viewer == null || (selectItemId == null && deselectItemId == null)) {
    return;
  }

  const scene = await viewer.scene();
  if (scene == null) return;

  await scene
    .items((op) => [
      ...(deselectItemId
        ? [op.where((q) => q.withItemId(deselectItemId)).deselect()]
        : []),
      ...(selectItemId
        ? [
            op
              .where((q) => q.withItemId(selectItemId))
              .select(createSelectColor(color)),
          ]
        : []),
    ])
    .execute();
}

export async function updateCamera({
  camera,
  viewer,
}: UpdateCameraReq): Promise<void> {
  if (viewer == null || camera == null) return;

  const scene = await viewer.scene();
  if (scene == null) return;

  await scene.camera().update(camera).render();
}
