---
title: "3D segmentation"
date: 2023-03-08
category: "CVNote"
excerpt: "第 4 期。点云与体素两条路线的分割方法梳理，顺带记一下 sparse conv 的几个坑。"
issue: 4
tags: ["3D", "分割", "点云"]
---

## 两条路线

**点云路线**（PointNet++ / Point Transformer）直接在无序点集上做局部聚合，好处是无损、坏处是邻域查询贵。

**体素路线**（SparseConv / Minkowski）把点投到稀疏体素网格上，规整了卷积但引入了量化误差。

## sparse conv 的坑

1. 体素化分辨率与显存是平方级关系，先降采样再升采样回投
2. `kernel_size=3` 在稀疏数据上会大量引入空体素，`stride=2` 反而更省
3. 配置里的 `voxel_size` 要与点云尺度对齐，否则小目标直接消失

```python
# 典型流程
coords = pc.voxelize(voxel_size=0.02)
out = sparse_conv(coords)          # U-Net 编码
logits = out.interpolate(point_coords)  # 回投到原始点
```

## 评估

mIoU 是主指标，但在类别极不均衡的室内场景里，**per-class IoU 的方差**比均值更有信息量。
