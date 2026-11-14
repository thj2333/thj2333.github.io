---
title: "nerf code"
date: 2023-03-08
category: "CVNote"
excerpt: "第 6 期。nerf-pytorch 逐行拆解：采样、编码、体渲染积分，以及那几个容易写错的细节。"
issue: 6
tags: ["NeRF", "源码", "PyTorch"]
---

## 网络结构

八层全连接 + 一层跳跃连接，前八层输出密度与特征，拼接方向编码后再过一层输出颜色。

```python
def forward(self, x, viewdirs):
    h = x
    for i, layer in enumerate(self.layers):
        h = F.relu(layer(h))
        if i == 4:                     # 跳跃连接
            h = torch.cat([h, x], dim=-1)
    sigma = self.sigma(h[:, :0])        # 密度只看位置
    rgb = self.rgb(torch.cat([h, viewdirs], dim=-1))
    return rgb, sigma
```

## 体渲染的三个易错点

1. **delta 的边界**：最后一段要补一个无穷远，否则背景密度积分缺一段
2. **累加顺序**：必须是从近到远，`T` 的乘法顺序不能反
3. **分层采样**：粗网络的结果要 detach 后再做重要性采样，否则梯度会串

```python
dists = torch.cat([d[:, :-1], d[:, -1:]], -1) - torch.cat([d[:, :1], d[:, :-1]], -1)
alpha = 1 - torch.exp(-sigma * dists)
weights = alpha * torch.cumprod(torch.cat([ones, 1-alpha+1e-10], -1), -1)[:, :-1]
rgb = (weights[..., None] * rgb).sum(-2)
```

第 3 点如果写错，训练能收敛但结果会明显发灰——因为它等价于给每条射线加了噪声梯度。
