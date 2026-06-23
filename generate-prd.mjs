import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, LevelFormat, HeadingLevel, BorderStyle, WidthType,
  ShadingType, PageNumber, PageBreak, TabStopType, TabStopPosition } from 'docx';
import fs from 'fs';

// ====== 辅助函数 ======

// 带颜色的表格单元格（标题行）
function headerCell(text, width, fill = "D9E2F3") {
  return new TableCell({
    borders: tableBorders,
    width: { size: width, type: WidthType.DXA },
    shading: { fill, type: ShadingType.CLEAR },
    margins: { top: 60, bottom: 60, left: 100, right: 100 },
    verticalAlign: "center",
    children: [new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text, bold: true, font: "微软雅黑", size: 21 })],
    })],
  });
}

function dataCell(text, width) {
  return new TableCell({
    borders: tableBorders,
    width: { size: width, type: WidthType.DXA },
    margins: { top: 60, bottom: 60, left: 100, right: 100 },
    children: [new Paragraph({
      children: [new TextRun({ text, font: "微软雅黑", size: 21 })],
    })],
  });
}

// 表格边框
const tableBorders = {
  top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
  bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
  left: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
  right: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
  insideH: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
  insideV: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
};

// 普通段落
function p(text, opts = {}) {
  return new Paragraph({
    spacing: { after: 120, line: 360 },
    ...opts,
    children: [new TextRun({ text, font: "微软雅黑", size: 21, ...opts.run })],
  });
}

// 标题
function heading(level, text) {
  return new Paragraph({
    heading: level,
    spacing: { before: 240, after: 120 },
    children: [new TextRun({ text, font: "微软雅黑", bold: true, size: level === HeadingLevel.HEADING_1 ? 32 : level === HeadingLevel.HEADING_2 ? 28 : 24 })],
  });
}

// 空行
function emptyLine() {
  return new Paragraph({ spacing: { after: 60 }, children: [] });
}

// 创建4列表格（带表头）
function table4Col(headers, rows, colWidths = [2268, 2268, 2268, 2268]) {
  const totalWidth = colWidths.reduce((a, b) => a + b, 0);
  return new Table({
    width: { size: totalWidth, type: WidthType.DXA },
    columnWidths: colWidths,
    rows: [
      new TableRow({
        children: headers.map((h, i) => headerCell(h, colWidths[i])),
      }),
      ...rows.map(row =>
        new TableRow({
          children: row.map((c, i) => dataCell(String(c), colWidths[i])),
        })
      ),
    ],
  });
}

// 创建5列表格（带表头）
function table5Col(headers, rows, colWidths = [1500, 2000, 2000, 2000, 1572]) {
  const totalWidth = colWidths.reduce((a, b) => a + b, 0);
  return new Table({
    width: { size: totalWidth, type: WidthType.DXA },
    columnWidths: colWidths,
    rows: [
      new TableRow({
        children: headers.map((h, i) => headerCell(h, colWidths[i])),
      }),
      ...rows.map(row =>
        new TableRow({
          children: row.map((c, i) => dataCell(String(c), colWidths[i])),
        })
      ),
    ],
  });
}

// 3列表格
function table3Col(headers, rows, colWidths = [2500, 3500, 3072]) {
  const totalWidth = colWidths.reduce((a, b) => a + b, 0);
  return new Table({
    width: { size: totalWidth, type: WidthType.DXA },
    columnWidths: colWidths,
    rows: [
      new TableRow({
        children: headers.map((h, i) => headerCell(h, colWidths[i])),
      }),
      ...rows.map(row =>
        new TableRow({
          children: row.map((c, i) => dataCell(String(c), colWidths[i])),
        })
      ),
    ],
  });
}

// ====== 构建文档 ======

const doc = new Document({
  styles: {
    default: {
      document: {
        run: { font: "微软雅黑", size: 21 },
        paragraph: { spacing: { after: 120 } },
      },
    },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 32, bold: true, font: "微软雅黑" },
        paragraph: { spacing: { before: 240, after: 240 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, font: "微软雅黑" },
        paragraph: { spacing: { before: 180, after: 180 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, font: "微软雅黑" },
        paragraph: { spacing: { before: 120, after: 120 }, outlineLevel: 2 } },
    ],
  },
  numbering: {
    config: [
      {
        reference: "bullets",
        levels: [{
          level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } },
        }],
      },
      {
        reference: "numbers",
        levels: [{
          level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } },
        }],
      },
    ],
  },
  sections: [{
    properties: {
      page: {
        size: { width: 11906, height: 16838 },
        margin: { top: 1440, right: 1200, bottom: 1440, left: 1200 },
      },
    },
    headers: {
      default: new Header({
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: "3B82F6", space: 4 } },
          children: [new TextRun({ text: "原采智擎 — 产品需求文档（PRD）", font: "微软雅黑", size: 16, color: "999999" })],
        })],
      }),
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: "第 ", font: "微软雅黑", size: 16 }),
            new TextRun({ children: [PageNumber.CURRENT], font: "微软雅黑", size: 16 }),
            new TextRun({ text: " 页", font: "微软雅黑", size: 16 }),
          ],
        })],
      }),
    },
    children: [

      // ========== 封面 ==========
      emptyLine(), emptyLine(), emptyLine(), emptyLine(),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 60 },
        children: [new TextRun({ text: "原采智擎", font: "微软雅黑", size: 44, bold: true, color: "3B82F6" })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 60 },
        children: [new TextRun({ text: "AI驱动的投标文件智能评审自查平台", font: "微软雅黑", size: 28, bold: true })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 600 },
        children: [new TextRun({ text: "产品需求文档（PRD）", font: "微软雅黑", size: 36, bold: true })],
      }),
      emptyLine(), emptyLine(),

      // 文档信息表
      table5Col(
        ["编写人", "审核人", "编写时间", "版本", "备注"],
        [["-", "-", "2026年06月18日", "V1.0", ""]],
        [1815, 1815, 1815, 1815, 1815]
      ),

      // ========== 分页 ==========
      new Paragraph({ children: [new PageBreak()] }),

      // ========== 1. 背景 ==========
      heading(HeadingLevel.HEADING_1, "1. 背景"),
      p("原采智擎是面向招投标场景的AI智能评审与标书编制平台。平台核心定位为\"投标全流程AI助手\"，围绕投标文件编制的全生命周期管理——从招标文件解析、投标资料配置、目录生成到正文编写的完整闭环，同时提供知识库管理、标书项目管理、积分管理等核心能力。"),
      p("目标用户："),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 60 },
        children: [new TextRun({ text: "投标专员：上传招标文件、使用AI解析和编写标书、管理个人标书项目", font: "微软雅黑", size: 21 })],
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 60 },
        children: [new TextRun({ text: "企业管理员：管理知识库（企业信息、资质、人员、业绩、方案模板等）、管理积分分配", font: "微软雅黑", size: 21 })],
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 120 },
        children: [new TextRun({ text: "决策者：查看标书质量评分、废标风险报告、标书进度", font: "微软雅黑", size: 21 })],
      }),

      // ========== 2. 功能模块总览 ==========
      heading(HeadingLevel.HEADING_1, "2. 功能模块总览"),
      table4Col(
        ["功能模块", "二级功能", "核心功能点", "功能介绍"],
        [
          ["首页", "营销展示", "产品介绍 / 能力展示 / CTA引导", "展示平台核心能力和数据指标，引导用户进入标书编制流程或充值"],
          ["标书编制", "新建标书", "5步流程（招标解析→基础设置→资料配置→目录→正文）", "从上传招标文件到生成完整标书的全流程AI辅助编制"],
          ["标书编制", "我的标书", "标书列表 / 筛选 / 编辑 / 下载 / 删除", "管理用户创建的所有标书项目，支持按类型和状态筛选"],
          ["知识库", "企业信息", "企业基本信息编辑维护", "维护企业基本资料，AI自动引用至标书\"公司介绍\"章节"],
          ["知识库", "资质证书", "证书列表 / 新增 / 编辑 / 删除", "管理企业资质证书，自动匹配招标文件的资质要求"],
          ["知识库", "人员信息", "人员列表 / 新增 / 编辑 / 删除", "管理投标团队人员信息，含岗位、证书、工作年限"],
          ["知识库", "类似业绩", "业绩列表 / 新增 / 编辑 / 删除", "管理企业历史项目业绩，AI匹配招标要求自动引用"],
          ["知识库", "方案模板", "模板列表 / 新增 / 编辑 / 删除", "管理技术方案模板，加速标书编写"],
          ["知识库", "历史标书", "历史标书列表 / 查看 / 删除", "查看和管理历史标书，支持提取内容复用"],
          ["积分系统", "积分管理", "积分充值 / 消耗明细 / 余额查看", "按次数计费，AI能力消耗积分，支持充值"],
        ],
        [1800, 1600, 2800, 2872]
      ),

      // ========== 分页 ==========
      new Paragraph({ children: [new PageBreak()] }),

      // ========== 3. 页面路由结构 ==========
      heading(HeadingLevel.HEADING_1, "3. 页面路由结构"),
      table3Col(
        ["路由", "页面名称", "说明"],
        [
          ["/", "首页（营销落地页）", "产品介绍和能力展示，引导用户使用"],
          ["/bid", "标书编制（布局页）", "左侧导航侧边栏 + 右侧子路由内容区"],
          ["/bid/", "标书首页", "展示可用的AI能力卡片，引导开始编制"],
          ["/bid/new", "新建标书（5步流程）", "核心业务页面：招标解析→基础设置→资料配置→目录→正文"],
          ["/bid/my", "我的标书", "标书项目列表，支持筛选、编辑、下载、删除"],
          ["/bid/library", "知识库", "企业资料集中管理，7个子分类页面"],
        ],
        [2500, 3000, 3572]
      ),

      // ========== 分页 ==========
      new Paragraph({ children: [new PageBreak()] }),

      // ========== 4. 系统功能 ==========
      heading(HeadingLevel.HEADING_1, "4. 系统功能"),

      // ---------- 4.1 首页 ----------
      heading(HeadingLevel.HEADING_2, "4.1 首页"),
      heading(HeadingLevel.HEADING_3, "4.1.1 首页 — 营销落地页"),
      p("优先级：P0　　参与者：所有访问用户"),
      emptyLine(),
      p("业务闭环："),
      p("用户访问首页 → 浏览产品介绍和核心数据 → 点击\"立即使用\"进入标书编制 → 点击\"观看演示\"了解产品功能 → 查看充值方案并充值"),
      emptyLine(),
      p("页面内容："),
      p("Hero区域："),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 60 },
        children: [new TextRun({ text: "左侧文案区：主标题\"AI驱动的投标文件智能评审自查\"，副标题介绍产品价值，带\"新一代AI深度学习驱动\"徽章标签", font: "微软雅黑", size: 21 })],
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 60 },
        children: [new TextRun({ text: "4个关键数据指标卡片：6+ 内置检查Skill、20+ 废标检查项、<3min 平均检查时间、95%+ 风险覆盖率", font: "微软雅黑", size: 21 })],
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 60 },
        children: [new TextRun({ text: "两个CTA按钮：\"立即使用\"（跳转/bid）、\"观看演示\"", font: "微软雅黑", size: 21 })],
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 60 },
        children: [new TextRun({ text: "右侧模拟分析仪表盘：展示评分98.5、置信度A+、处理时间0.8s，带悬浮动画效果", font: "微软雅黑", size: 21 })],
      }),
      emptyLine(),
      p("核心能力展示区（3列卡片）："),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 60 },
        children: [new TextRun({ text: "文件快速研读：毫秒级响应速度，即刻解析复杂文档逻辑", font: "微软雅黑", size: 21 })],
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 60 },
        children: [new TextRun({ text: "智能文档解析：上传招标文件和投标文件，AI自动提取废标/否决条款，精准识别关键要求", font: "微软雅黑", size: 21 })],
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 120 },
        children: [new TextRun({ text: "Skill引擎检查：基于可配置的Skill检查引擎，覆盖签章、资质、报价、技术响应等多维度检查", font: "微软雅黑", size: 21 })],
      }),
      emptyLine(),
      p("充值CTA区域："),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 60 },
        children: [new TextRun({ text: "展示推荐充值方案：500积分+200积分 / ¥500，含\"超值赠送\"和\"推荐\"标签", font: "微软雅黑", size: 21 })],
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 60 },
        children: [new TextRun({ text: "6项特性列表：充值500送200积分、积分永久有效、支持所有AI检查Skill、详细评分报告、历史记录永久保存、专业技术支持", font: "微软雅黑", size: 21 })],
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 120 },
        children: [new TextRun({ text: "\"立即充值\"按钮", font: "微软雅黑", size: 21 })],
      }),

      // ========== 分页 ==========
      new Paragraph({ children: [new PageBreak()] }),

      // ---------- 4.2 标书编制 — 标书首页 ----------
      heading(HeadingLevel.HEADING_2, "4.2 标书编制"),
      heading(HeadingLevel.HEADING_3, "4.2.1 标书首页"),
      p("优先级：P0　　参与者：所有已登录用户"),
      emptyLine(),
      p("业务闭环："),
      p("用户进入标书编制模块 → 查看可用的AI能力卡片 → 点击\"立即使用\"→ 确认积分消耗 → 进入新建标书5步流程"),
      emptyLine(),
      p("页面内容："),
      p("标题：\"您的智能标书生成助手\""),
      p("AI能力卡片（当前：智能标书生成助手）："),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 60 },
        children: [new TextRun({ text: "卡片展示：能力名称、能力描述\"上传招标文件，AI自动解读评分项、生成目录并编写正文\"", font: "微软雅黑", size: 21 })],
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 60 },
        children: [new TextRun({ text: "消耗标识：100 积分/次", font: "微软雅黑", size: 21 })],
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 120 },
        children: [new TextRun({ text: "\"立即使用\"按钮", font: "微软雅黑", size: 21 })],
      }),
      emptyLine(),
      p("交互逻辑："),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 60 },
        children: [new TextRun({ text: "点击\"立即使用\"→ 弹出积分确认弹窗，显示当前积分、本次消耗（-100）、扣除后余额", font: "微软雅黑", size: 21 })],
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 60 },
        children: [new TextRun({ text: "确认 → 跳转到 /bid/new 进入新建标书流程", font: "微软雅黑", size: 21 })],
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 120 },
        children: [new TextRun({ text: "取消 → 关闭弹窗，停留在当前页面", font: "微软雅黑", size: 21 })],
      }),

      // ---------- 4.2.2 新建标书流程 ----------
      heading(HeadingLevel.HEADING_3, "4.2.2 新建标书 — 5步流程总览"),
      p("优先级：P0　　参与者：所有已登录用户"),
      emptyLine(),
      p("业务闭环："),
      p("用户确认积分消耗 → 进入5步流程 → Step1上传招标文件并AI解析 → Step2设置标书基础信息 → Step3配置投标资料（从知识库引用或上传）→ Step4 AI生成目录并调整 → Step5 AI编写正文并导出"),
      emptyLine(),
      p("通用UI元素（Step1-4）："),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 60 },
        children: [new TextRun({ text: "顶部栏：左侧\"退出\"按钮（点击后确认弹窗，提示草稿已保存），中间Stepper步骤条（5步），右侧\"草稿已自动保存\"", font: "微软雅黑", size: 21 })],
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 120 },
        children: [new TextRun({ text: "底部：上一步 / 下一步 导航按钮", font: "微软雅黑", size: 21 })],
      }),
      emptyLine(),

      p("Step1 — 招标文件解读："),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 60 },
        children: [new TextRun({ text: "左侧（40%）：文件上传区。支持拖拽/点击上传招标文件，上传后模拟1.5秒解析。展示AI能力说明（5项识别能力）和安全提示。上传完成后可\"查看来源\"", font: "微软雅黑", size: 21 })],
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 60 },
        children: [new TextRun({ text: "右侧（60%）：AI解析结果。8个Tab标签页——项目概况、资格要求、初步评审标准、评分标准、重点响应要求、风险提示、关键时间节点、其他关键信息。初始显示解析进度动画（8步逐步完成）", font: "微软雅黑", size: 21 })],
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 60 },
        children: [new TextRun({ text: "评分标准Tab：三个子表（技术评分标准、商务评分标准、报价评分标准），支持新增/删除行", font: "微软雅黑", size: 21 })],
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 60 },
        children: [new TextRun({ text: "支持编辑/完成模式切换、重新解析、放大查看", font: "微软雅黑", size: 21 })],
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 120 },
        children: [new TextRun({ text: "下一步按钮：文件未解析完成时禁用", font: "微软雅黑", size: 21 })],
      }),
      emptyLine(),

      p("Step2 — 标书基础设置："),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 60 },
        children: [new TextRun({ text: "基础信息：标书名称（必填，含验证）、标书类型（4个卡片选项：服务类/物资类/工程类/其他）、标书页数（滑块调节20-1000页，含预设按钮和加减按钮）", font: "微软雅黑", size: 21 })],
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 120 },
        children: [new TextRun({ text: "图表与配图：表格密度（无/少量/适量/大量）、智能配图（无/少量/适量/大量）", font: "微软雅黑", size: 21 })],
      }),

      // ========== 分页 ==========
      new Paragraph({ children: [new PageBreak()] }),

      p("Step3 — 投标资料配置："),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 60 },
        children: [new TextRun({ text: "企业信息：企业名称（必填）、主营业务、企业简介。可从知识库引用或上传文件", font: "微软雅黑", size: 21 })],
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 60 },
        children: [new TextRun({ text: "资质/人员/业绩/方案：均支持从知识库多选（右侧滑出抽屉选择器）和上传文件两种方式", font: "微软雅黑", size: 21 })],
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 60 },
        children: [new TextRun({ text: "项目响应内容：根据标书类型动态显示不同标签（项目响应内容/产品参数/工程量清单/业务资料），支持上传文件", font: "微软雅黑", size: 21 })],
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 60 },
        children: [new TextRun({ text: "历史标书提取：支持从历史标书提取方案章节复用", font: "微软雅黑", size: 21 })],
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 120 },
        children: [new TextRun({ text: "必填项：企业名称和项目响应内容", font: "微软雅黑", size: 21 })],
      }),
      emptyLine(),

      p("Step4 — 编写目录："),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 60 },
        children: [new TextRun({ text: "左侧：招标文件参考面板。Tab切换——招标文件原文、项目概述、评分标准、资格要求、技术要求、风险提示、其他关键信息。评分标准含三个子表", font: "微软雅黑", size: 21 })],
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 60 },
        children: [new TextRun({ text: "右侧：标书目录编辑器。统计信息（X章·X节·X页），操作按钮（重新生成、下载目录）。层级目录结构（章→节→子节），全部可编辑——重命名、设置页数、上移/下移、新增/删除。\"新增章节\"按钮", font: "微软雅黑", size: 21 })],
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 60 },
        children: [new TextRun({ text: "默认目录结构：6章（项目概述、技术方案、项目实施、服务与培训、商务条款、资质证明），合计约80页", font: "微软雅黑", size: 21 })],
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 120 },
        children: [new TextRun({ text: "目录预览弹窗：确认前预览完整目录结构，提示\"进入正文编写后目录将被锁定\"", font: "微软雅黑", size: 21 })],
      }),
      emptyLine(),

      p("Step5 — 编写正文："),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 60 },
        children: [new TextRun({ text: "顶栏：返回按钮、标书名称、草稿保存状态、状态标签（编写中/已完成）、\"导出标书\"按钮", font: "微软雅黑", size: 21 })],
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 60 },
        children: [new TextRun({ text: "统计栏：模式切换（目录模式/正文模式）、总章节、已完成数、实际字数、进度条、目标字数", font: "微软雅黑", size: 21 })],
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 60 },
        children: [new TextRun({ text: "目录模式：每章卡片列出所有小节，每节显示标题、状态标签、字数进度、操作按钮（调整字数/编写本章/继续/重写）", font: "微软雅黑", size: 21 })],
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 60 },
        children: [new TextRun({ text: "正文模式（三栏布局）：左侧章节目录树（可点击切换），中间富文本编辑器（AI编写中动画+可编辑区），右侧AI写作助手面板（智能改写：扩写/精简/重写/继续编写；智能生成：插入案例/生成流程图/生成表格；图片搜索和上传；补充参考资料）", font: "微软雅黑", size: 21 })],
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 120 },
        children: [new TextRun({ text: "从\"我的标书\"编辑进入且状态为已完成时，所有节显示为已完成", font: "微软雅黑", size: 21 })],
      }),

      // ========== 分页 ==========
      new Paragraph({ children: [new PageBreak()] }),

      // ---------- 4.2.3 我的标书 ----------
      heading(HeadingLevel.HEADING_3, "4.2.3 我的标书"),
      p("优先级：P1　　参与者：所有已登录用户"),
      emptyLine(),
      p("业务闭环："),
      p("用户进入我的标书 → 查看所有已创建标书 → 按类型/状态筛选 → 搜索 → 编辑标书（进入Step5）→ 下载已完成标书 → 删除标书"),
      emptyLine(),
      p("页面内容："),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 60 },
        children: [new TextRun({ text: "筛选栏：标书类型下拉（全部/服务类/物资类/工程类/其他）、标书状态下拉（全部/草稿/编写中/已完成）、搜索框", font: "微软雅黑", size: 21 })],
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 60 },
        children: [new TextRun({ text: "标书列表表格：标书名称、类型、状态（草稿/编写中/已完成，带彩色标签）、进度（进度条+百分比）、创建时间、最后编辑、操作（编辑/下载/删除）", font: "微软雅黑", size: 21 })],
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 120 },
        children: [new TextRun({ text: "下载功能仅对已完成标书显示，模拟90%成功率", font: "微软雅黑", size: 21 })],
      }),
      emptyLine(),
      p("交互逻辑："),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 60 },
        children: [new TextRun({ text: "点击\"编辑\"→ 跳转到 /bid/new?step=5&from=my，进入正文编写页面", font: "微软雅黑", size: 21 })],
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 60 },
        children: [new TextRun({ text: "点击\"删除\"→ 弹出二次确认弹窗 → 确认后删除并Toast提示", font: "微软雅黑", size: 21 })],
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 60 },
        children: [new TextRun({ text: "筛选条件变化 → 实时过滤列表", font: "微软雅黑", size: 21 })],
      }),

      // ---------- 4.3 知识库 ----------
      heading(HeadingLevel.HEADING_2, "4.3 知识库"),
      heading(HeadingLevel.HEADING_3, "4.3.1 知识库总览"),
      p("优先级：P1　　参与者：所有已登录用户"),
      emptyLine(),
      p("业务闭环："),
      p("用户进入知识库 → 7个子分类页面（知识库首页/企业信息/资质证书/人员信息/类似业绩/方案模板/历史标书）→ 在各子页面进行增删改查操作 → AI在标书编制时自动引用知识库数据"),
      emptyLine(),
      p("7个子分类页面功能："),

      table4Col(
        ["子分类", "功能", "数据内容", "AI引用方式"],
        [
          ["知识库首页", "统计概览 + 最近引用", "6个统计卡片（企业信息/资质/人员/业绩/模板/历史标书各数量）", "—"],
          ["企业信息", "查看/编辑", "企业名称、统一社会信用代码、主营业务、企业简介、LOGO、组织架构图、营业执照", "自动引用至标书\"公司介绍\"章节"],
          ["资质证书", "增删改查 + 搜索", "证书名称、证书编号、发证机构、有效期、状态（有效/即将过期/已过期）", "自动匹配招标文件的资质要求"],
          ["人员信息", "增删改查", "姓名、岗位、联系电话、工作年限、证书数量", "匹配招标文件的人员配置要求"],
          ["类似业绩", "增删改查", "项目名称、类型、合同金额、建设地点、时间", "匹配招标要求的类似项目经验"],
          ["方案模板", "增删改查", "方案名称、适用场景、更新时间", "提供标书章节编写的参考模板"],
          ["历史标书", "查看/删除", "标书名称、创建时间", "支持从历史标书提取方案内容复用"],
        ],
        [1500, 1500, 3400, 2672]
      ),

      // ========== 分页 ==========
      new Paragraph({ children: [new PageBreak()] }),

      heading(HeadingLevel.HEADING_3, "4.3.2 知识库交互逻辑"),
      p("通用交互："),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 60 },
        children: [new TextRun({ text: "搜索功能：顶部搜索框实时过滤列表", font: "微软雅黑", size: 21 })],
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 60 },
        children: [new TextRun({ text: "新增资料：弹窗表单 + 文件上传 + \"同步保存至知识库\"复选框", font: "微软雅黑", size: 21 })],
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 60 },
        children: [new TextRun({ text: "删除操作：二次确认弹窗，防止误删", font: "微软雅黑", size: 21 })],
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 120 },
        children: [new TextRun({ text: "Toast提示：操作成功/失败反馈", font: "微软雅黑", size: 21 })],
      }),

      // ---------- 4.4 标书编制布局 ----------
      heading(HeadingLevel.HEADING_2, "4.4 标书编制布局页"),
      p("优先级：P0　　参与者：所有已登录用户"),
      emptyLine(),
      p("页面结构："),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 60 },
        children: [new TextRun({ text: "顶部：SiteHeader导航栏（首页/标书编制/工作台/充值）", font: "微软雅黑", size: 21 })],
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 60 },
        children: [new TextRun({ text: "左侧固定侧边栏（240px）：分类标题\"标书编制\" + 三个导航项（首页→/bid、知识库→/bid/library、我的标书→/bid/my），高亮当前路由", font: "微软雅黑", size: 21 })],
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 60 },
        children: [new TextRun({ text: "右侧主内容区：通过路由Outlet渲染子页面", font: "微软雅黑", size: 21 })],
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 120 },
        children: [new TextRun({ text: "智能导航：在/bid/new流程中，侧边栏高亮根据来源判断——来自\"我的标书\"则高亮\"我的标书\"，否则高亮\"首页\"", font: "微软雅黑", size: 21 })],
      }),

      // ========== 分页 ==========
      new Paragraph({ children: [new PageBreak()] }),

      // ========== 5. 核心组件说明 ==========
      heading(HeadingLevel.HEADING_1, "5. 核心组件说明"),

      table5Col(
        ["组件名称", "所属模块", "功能描述", "交互细节", "复用场景"],
        [
          ["UploadZone", "标书编制", "文件上传区组件，支持拖拽/点击上传", "上传后模拟1.5秒解析，显示文件名+大小+状态图标，支持删除和预览回调", "Step1招标文件上传、Step3资料上传、知识库文件上传"],
          ["ParsingProgress", "标书编制", "AI解析进度动画组件", "逐步完成动画（每步380ms），显示旋转动画+步骤列表（已完成/进行中/未开始）", "Step1招标文件解析"],
          ["SourceViewer", "标书编制", "招标文件原文查看器", "模拟PDF预览，黄色高亮指示原文位置，支持多出处导航", "Step1查看来源、Step4招标文件参考"],
          ["KbPickerDrawer", "标书编制", "知识库选择器抽屉", "右侧滑出，支持搜索、分组筛选、多选/单选，已选标签可逐个移除", "Step3资料配置（资质/人员/业绩/方案选择）"],
          ["Stepper", "标书编制", "5步进度指示器", "已完成绿色对勾+连线、当前步蓝色圆形+阴影、未完成灰色圆形", "新建标书流程Step1-4"],
          ["HistoryExtractDrawer", "标书编制", "历史标书提取抽屉", "从历史标书选择方案章节文件复用", "Step3资料配置"],
          ["UploadConfirmDialog", "标书编制", "上传确认弹窗", "含同步至知识库复选框", "Step3资料上传"],
          ["FilePreviewDialog", "标书编制", "文件预览弹窗", "模拟文档预览", "Step3资料预览"],
          ["SiteHeader", "全局", "顶部导航栏", "Logo+导航链接（首页/标书编制/工作台/充值），当前路由高亮，用户头像", "所有页面"],
          ["SiteFooter", "全局", "底部页脚", "ICP备案号、用户协议、隐私政策、联系我们", "所有页面"],
        ],
        [1500, 1200, 2200, 2800, 1372]
      ),

      // ========== 分页 ==========
      new Paragraph({ children: [new PageBreak()] }),

      // ========== 6. 数据与状态管理 ==========
      heading(HeadingLevel.HEADING_1, "6. 数据与状态管理"),

      heading(HeadingLevel.HEADING_2, "6.1 模拟数据（mockKb）"),
      p("当前版本使用本地模拟数据，包含以下数据集："),
      table3Col(
        ["数据集", "数据量", "说明"],
        [
          ["资质证书（mockCerts）", "8份", "营业执照、ISO9001/20000/27001、CMMI3、高新技术企业、增值电信许可、涉密集成资质"],
          ["人员信息（mockStaff）", "8人", "总监、监理工程师、项目经理、技术总监等，含证书信息"],
          ["类似业绩（mockCases）", "6个", "医院信息化、智慧校园、政务云、智慧路灯等"],
          ["方案模板（mockTemplates）", "5个", "监理服务、政务云技术、硬件采购、运维服务、网络安全"],
          ["历史标书（mockHistory）", "3个", "历史标书记录"],
          ["企业信息（mockCompany）", "1份", "企业名称、统一社会信用代码、主营业务、简介"],
        ],
        [2500, 1500, 5072]
      ),

      heading(HeadingLevel.HEADING_2, "6.2 标书状态"),
      table4Col(
        ["状态", "说明", "来源", "可操作"],
        [
          ["草稿", "已创建但未完成编写", "新建标书流程中保存退出", "编辑（进入Step5）"],
          ["编写中", "正在编写正文", "Step5中正在编写", "编辑（继续编写）"],
          ["已完成", "全部章节编写完成", "Step5全部节完成", "编辑、下载、删除"],
        ],
        [2000, 2200, 2400, 2472]
      ),

      heading(HeadingLevel.HEADING_2, "6.3 标书类型"),
      table4Col(
        ["编码", "类型", "说明", "关联响应内容标签"],
        [
          ["1", "服务类", "技术服务、运维服务等", "项目响应内容"],
          ["2", "物资类", "设备采购、物资供应等", "产品参数"],
          ["3", "工程类", "工程建设、施工项目等", "工程量清单"],
          ["4", "其他", "其他类型标书", "业务资料"],
        ],
        [1500, 1800, 2800, 2972]
      ),

      // ========== 分页 ==========
      new Paragraph({ children: [new PageBreak()] }),

      // ========== 7. 积分体系 ==========
      heading(HeadingLevel.HEADING_1, "7. 积分体系"),

      heading(HeadingLevel.HEADING_2, "7.1 积分规则"),
      p("积分是平台的虚拟货币，用于消耗AI能力："),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 60 },
        children: [new TextRun({ text: "每次使用AI标书生成能力消耗100积分", font: "微软雅黑", size: 21 })],
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 60 },
        children: [new TextRun({ text: "充值方案：500积分+赠送200积分 = ¥500", font: "微软雅黑", size: 21 })],
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 60 },
        children: [new TextRun({ text: "积分永久有效，历史记录永久保存", font: "微软雅黑", size: 21 })],
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 120 },
        children: [new TextRun({ text: "当前版本模拟积分余额：1280积分", font: "微软雅黑", size: 21 })],
      }),

      heading(HeadingLevel.HEADING_2, "7.2 积分交互"),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 60 },
        children: [new TextRun({ text: "使用AI能力前弹出积分确认弹窗，展示当前积分、本次消耗、扣除后余额", font: "微软雅黑", size: 21 })],
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 60 },
        children: [new TextRun({ text: "用户确认后扣除积分并进入功能", font: "微软雅黑", size: 21 })],
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 120 },
        children: [new TextRun({ text: "积分不足时提示用户充值", font: "微软雅黑", size: 21 })],
      }),

      // ========== 分页 ==========
      new Paragraph({ children: [new PageBreak()] }),

      // ========== 8. 全局说明 ==========
      heading(HeadingLevel.HEADING_1, "8. 全局说明"),

      heading(HeadingLevel.HEADING_2, "8.1 技术架构"),
      table3Col(
        ["技术项", "技术选型", "说明"],
        [
          ["前端框架", "React 19 + TanStack React Start", "SSR框架，服务端渲染提升首屏性能"],
          ["路由", "TanStack React Router", "文件路由系统，支持嵌套路由和布局"],
          ["样式方案", "Tailwind CSS 4", "原子化CSS，使用Material Symbols图标"],
          ["构建工具", "Vite 7", "开发服务器和构建工具"],
          ["部署目标", "Cloudflare Workers", "边缘计算部署"],
          ["UI组件", "Radix UI", "无样式可访问性组件库"],
          ["状态管理", "React useState + TanStack React Query", "本地状态 + 服务端状态（Query已配置）"],
        ],
        [2000, 3000, 4072]
      ),

      heading(HeadingLevel.HEADING_2, "8.2 路由与导航"),
      table3Col(
        ["路由路径", "页面", "导航入口"],
        [
          ["/", "首页", "浏览器直接访问 / Logo点击"],
          ["/bid", "标书编制布局", "首页\"立即使用\" / 顶部导航\"标书编制\""],
          ["/bid/", "标书首页（能力卡片）", "侧边栏\"首页\""],
          ["/bid/new", "新建标书（5步流程）", "标书首页\"立即使用\""],
          ["/bid/my", "我的标书", "侧边栏\"我的标书\""],
          ["/bid/library", "知识库", "侧边栏\"知识库\""],
        ],
        [2000, 2800, 4272]
      ),

      heading(HeadingLevel.HEADING_2, "8.3 当前版本说明"),
      p("当前版本为前端原型版本（V1.0），以下功能使用模拟数据："),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 60 },
        children: [new TextRun({ text: "AI解析：模拟解析进度动画，使用预设的解析结果数据", font: "微软雅黑", size: 21 })],
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 60 },
        children: [new TextRun({ text: "AI目录生成：模拟1.4秒生成动画，使用预设的6章目录结构", font: "微软雅黑", size: 21 })],
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 60 },
        children: [new TextRun({ text: "AI正文编写：模拟流式生成效果，使用预设内容", font: "微软雅黑", size: 21 })],
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 60 },
        children: [new TextRun({ text: "文件上传：模拟1.5秒解析流程，不实际处理文件", font: "微软雅黑", size: 21 })],
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 60 },
        children: [new TextRun({ text: "积分系统：模拟余额1280，不连接真实支付", font: "微软雅黑", size: 21 })],
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 60 },
        children: [new TextRun({ text: "知识库：使用mockKb模拟数据，不连接后端数据库", font: "微软雅黑", size: 21 })],
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 120 },
        children: [new TextRun({ text: "用户系统：未实现登录/注册，显示模拟用户头像", font: "微软雅黑", size: 21 })],
      }),

      // ========== 分页 ==========
      new Paragraph({ children: [new PageBreak()] }),

      // ========== 9. 后续迭代规划 ==========
      heading(HeadingLevel.HEADING_1, "9. 后续迭代规划"),

      heading(HeadingLevel.HEADING_2, "9.1 V1.1 后端对接"),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 60 },
        children: [new TextRun({ text: "对接AI解析引擎，实现真实的招标文件解析（当前为模拟）", font: "微软雅黑", size: 21 })],
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 60 },
        children: [new TextRun({ text: "对接AI写作引擎，实现真实的标书正文生成", font: "微软雅黑", size: 21 })],
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 60 },
        children: [new TextRun({ text: "对接真实文件上传服务（OSS/CDN）", font: "微软雅黑", size: 21 })],
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 120 },
        children: [new TextRun({ text: "对接数据库，知识库数据持久化", font: "微软雅黑", size: 21 })],
      }),

      heading(HeadingLevel.HEADING_2, "9.2 V1.2 用户系统"),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 60 },
        children: [new TextRun({ text: "实现用户注册/登录/权限管理", font: "微软雅黑", size: 21 })],
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 60 },
        children: [new TextRun({ text: "实现企业多用户协作（标书协同编辑）", font: "微软雅黑", size: 21 })],
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 120 },
        children: [new TextRun({ text: "实现角色权限控制（管理员/投标专员/查看者）", font: "微软雅黑", size: 21 })],
      }),

      heading(HeadingLevel.HEADING_2, "9.3 V1.3 支付与积分"),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 60 },
        children: [new TextRun({ text: "对接微信支付/支付宝等支付渠道", font: "微软雅黑", size: 21 })],
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 60 },
        children: [new TextRun({ text: "实现积分消费明细与账单系统", font: "微软雅黑", size: 21 })],
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 120 },
        children: [new TextRun({ text: "实现多种充值方案和优惠活动", font: "微软雅黑", size: 21 })],
      }),

      heading(HeadingLevel.HEADING_2, "9.4 V2.0 高级功能"),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 60 },
        children: [new TextRun({ text: "Skill检查引擎：实现签章、资质、报价、技术响应等多维度自动检查", font: "微软雅黑", size: 21 })],
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 60 },
        children: [new TextRun({ text: "废标风险检测：自动识别废标风险点并生成风险报告", font: "微软雅黑", size: 21 })],
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 60 },
        children: [new TextRun({ text: "标书评分：对标书进行综合评分并给出改进建议", font: "微软雅黑", size: 21 })],
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 60 },
        children: [new TextRun({ text: "标书对比：多版本标书差异对比和优劣分析", font: "微软雅黑", size: 21 })],
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 60 },
        children: [new TextRun({ text: "标书模板市场：社区共享标书模板和方案", font: "微软雅黑", size: 21 })],
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 120 },
        children: [new TextRun({ text: "移动端适配：支持手机端查看标书进度和审批", font: "微软雅黑", size: 21 })],
      }),

    ],
  }],
});

// ====== 生成文件 ======
const buffer = await Packer.toBuffer(doc);
const outputPath = "/Users/jingyi/Desktop/原采智擎-标书编制助手-产品需求文档.docx";
fs.writeFileSync(outputPath, buffer);
console.log(`✅ 需求文档已生成: ${outputPath}`);
