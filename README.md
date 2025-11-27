# CineGen AI Director (AI 漫剧工场)

> **工业级 AI 漫剧与视频生成工作台**
> *Industrial AI Motion Comic & Video Workbench*

[![中文](https://img.shields.io/badge/Language-中文-blue.svg)](./README.md)
[![English](https://img.shields.io/badge/Language-English-gray.svg)](./README_EN.md)
[![日本語](https://img.shields.io/badge/Language-日本語-gray.svg)](./README_JA.md)

**CineGen AI Director** 是一个专为 **AI 漫剧 (Motion Comics)**、**动态漫画**及**影视分镜 (Animatic)** 设计的专业生产力工具。

它摒弃了传统的“抽卡式”生成，采用 **"Script-to-Asset-to-Keyframe"** 的工业化工作流。通过深度集成 Google Gemini 2.5 Flash 和 Veo 模型，实现了对角色一致性、场景连续性以及镜头运动的精准控制。

![UI Preview](./UI.png)

## 核心理念：关键帧驱动 (Keyframe-Driven)

传统的 Text-to-Video 往往难以控制具体的运镜和起止画面。CineGen 引入了动画制作中的 **关键帧 (Keyframe)** 概念：
1.  **先画后动**：先生成精准的起始帧 (Start) 和结束帧 (End)。
2.  **插值生成**：利用 Veo 模型在两帧之间生成平滑的视频过渡。
3.  **资产约束**：所有画面生成均受到“角色定妆照”和“场景概念图”的强约束，杜绝人物变形。

## 核心功能模块

### Phase 01: 剧本与分镜 (Script & Storyboard)
*   **智能剧本拆解**：输入小说或故事大纲，AI 自动拆解为包含场次、时间、气氛的标准剧本结构。
*   **视觉化翻译**：自动将文字描述转化为专业的 Midjourney/Stable Diffusion 提示词。
*   **节奏控制**：支持设定目标时长（如 30s 预告片、3min 短剧），AI 自动规划镜头密度。

### Phase 02: 资产与选角 (Assets & Casting)
*   **一致性定妆 (Character Consistency)**：
    *   为每个角色生成标准参考图 (Reference Image)。
    *   **衣橱系统 (Wardrobe System)**：支持多套造型 (如：日常、战斗、受伤)，基于 Base Look 保持面部特征一致。
*   **场景概念 (Set Design)**：生成环境参考图，确保同一场景下的不同镜头光影统一。

### Phase 03: 导演工作台 (Director Workbench)
*   **网格化分镜表**：全景式管理所有镜头 (Shots)。
*   **精准控制**：
    *   **Start Frame**: 生成镜头的起始画面（强一致性）。
    *   **End Frame**: (可选) 定义镜头结束时的状态（如：人物回头、光线变化）。
*   **上下文感知**：AI 生成镜头时，会自动读取 Context（当前场景图 + 当前角色特定服装图），彻底解决“不连戏”问题。
*   **Veo 视频生成**：支持 Image-to-Video 和 Keyframe Interpolation 两种模式。

### Phase 04: 成片与导出 (Export)
*   **实时预览**：时间轴形式预览生成的漫剧片段。
*   **渲染追踪**：实时监控 API 渲染进度。
*   **资产导出**：支持导出所有高清关键帧和 MP4 片段，方便导入 Premiere/After Effects 进行后期剪辑。

## 技术架构

*   **Frontend**: React 19, Tailwind CSS (Sony Industrial Design Style)
*   **AI Models**:
    *   **Logic/Text**: `gemini-2.5-flash` (高智商剧本分析)
    *   **Vision**: `gemini-2.5-flash-image` (Nano Banana - 高速绘图)
    *   **Video**: `veo-3.1-fast-generate-preview` (首尾帧视频插值)
*   **Storage**: IndexedDB (本地浏览器数据库，数据隐私安全，无后端依赖)

## 快速开始

1.  **配置密钥**: 启动应用，输入 Google Gemini API Key (需开通 GCP 结算以使用 Veo)。
2.  **故事输入**: 在 Phase 01 输入你的故事创意，点击“生成分镜脚本”。
3.  **美术设定**: 进入 Phase 02，生成主角定妆照和核心场景图。
4.  **分镜制作**: 进入 Phase 03，逐个生成镜头的关键帧。
5.  **动效生成**: 确认关键帧无误后，批量生成视频片段。

---
*Built for Creators, by CineGen.*
