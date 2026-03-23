export function transformSongToCSVRow(song) {
  const {UMAP2D, UMAP3D, complaints, ...rest} = song;

  return {
    ...rest,

    // flatten UMAP2D
    UMAP_2D_1: UMAP2D?.UMAP_1 ?? null,
    UMAP_2D_2: UMAP2D?.UMAP_2 ?? null,

    // flatten UMAP3D
    UMAP_3D_1: UMAP3D?.UMAP_1 ?? null,
    UMAP_3D_2: UMAP3D?.UMAP_2 ?? null,
    UMAP_3D_3: UMAP3D?.UMAP_3 ?? null,
  };
}
