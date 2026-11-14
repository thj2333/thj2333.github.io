---
title: "3D AIGC (nerf+diffusion)"
date: 2023-03-08
category: "CVNote"
excerpt: "第 5 期。当扩散模型遇上隐式场：DreamFusion 那套 SDS 损失是怎么绕开 3D 数据的。"
issue: 5
tags: ["AIGC", "Diffusion", "NeRF"]
---

## 问题

3D 数据昂贵且稀缺，但 2D 图文对海量。于是真正的思路是：**用 2D 扩散模型当裁判，去监督一个 3D 表示**。

## SDS：Score Distillation Sampling

把渲染出的图加噪送到扩散模型，取其对噪声的预测误差作为梯度，回传给 3D 参数。

```text
∇_θ L_SDS = E[ w(t) · (ε̂(z_t, t, c) - ε) · ∂x/∂θ ]
```

它不是一个真正的损失函数（没有可积的能量），只是一个**梯度场**，所以监控训练时看到的 loss 数值本身没什么意义。

## 工程上的几个观察

- 视角分辨率要够，否则形状会「塌」成二维贴片
- 正负提示词（prompt / negative prompt）对几何干净程度影响很大
- 密度正则化能显著减少「云状漂浮物」

> 这条路线的天花板在于 2D 先验的视角不一致性，几何细节越多越明显。
