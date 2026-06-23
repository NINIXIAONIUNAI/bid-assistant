export type KbCert = { id: string; name: string; code: string; issuer: string; expiry: string; status: "有效" | "即将过期" | "已过期" };
export type KbStaff = { id: string; name: string; role: string; phone: string; years: number; certs: string[] };
export type KbCase = { id: string; name: string; type: string; amount: string; date: string; place: string; scope: string; outcome: string };
export type KbTemplate = { id: string; name: string; scene: string; updated: string };
export type KbHistory = { id: string; name: string; created: string };

export const mockCerts: KbCert[] = [
  { id: "c1", name: "营业执照", code: "91440300MA5XXXXX0Q", issuer: "市场监督管理局", expiry: "长期", status: "有效" },
  { id: "c2", name: "ISO9001 质量管理体系认证", code: "00224Q12345R0M", issuer: "方圆认证", expiry: "2027-03-20", status: "有效" },
  { id: "c3", name: "ISO20000 IT服务管理体系", code: "00224IT12345", issuer: "方圆认证", expiry: "2026-07-10", status: "即将过期" },
  { id: "c4", name: "ISO27001 信息安全管理体系", code: "00224IS54321", issuer: "方圆认证", expiry: "2027-08-15", status: "有效" },
  { id: "c5", name: "CMMI 3 级认证", code: "CMMI-3-2024-088", issuer: "CMMI Institute", expiry: "2027-01-12", status: "有效" },
  { id: "c6", name: "高新技术企业证书", code: "GR202544000888", issuer: "省科技厅", expiry: "2026-12-01", status: "有效" },
  { id: "c7", name: "增值电信业务经营许可证", code: "B1-2024XXXXX", issuer: "工信部", expiry: "2029-05-30", status: "有效" },
  { id: "c8", name: "涉密信息系统集成资质（甲级）", code: "BMJ2024A0066", issuer: "国家保密局", expiry: "2028-11-22", status: "有效" },
];

export const mockStaff: KbStaff[] = [
  { id: "s1", name: "张三", role: "总监", phone: "138-0000-1111", years: 18, certs: ["注册监理工程师", "一级建造师", "高级工程师"] },
  { id: "s2", name: "李四", role: "监理工程师", phone: "138-0000-2222", years: 10, certs: ["注册监理工程师"] },
  { id: "s3", name: "王五", role: "项目经理", phone: "138-0000-3333", years: 12, certs: ["PMP", "信息系统项目管理师"] },
  { id: "s4", name: "赵六", role: "技术总监", phone: "138-0000-4444", years: 15, certs: ["系统架构师", "信息安全工程师"] },
  { id: "s5", name: "周七", role: "实施工程师", phone: "138-0000-5555", years: 6, certs: ["软件设计师"] },
  { id: "s6", name: "吴八", role: "网络工程师", phone: "138-0000-6666", years: 8, certs: ["CCNP", "华为HCIE"] },
  { id: "s7", name: "郑九", role: "安全工程师", phone: "138-0000-7777", years: 7, certs: ["CISP", "等保测评师"] },
  { id: "s8", name: "钱十", role: "测试工程师", phone: "138-0000-8888", years: 5, certs: ["软件评测师"] },
];

export const mockCases: KbCase[] = [
  { id: "k1", name: "长沙市中心医院信息化监理", type: "服务类", amount: "680 万", date: "2024-12", place: "长沙市", scope: "HIS/EMR 系统建设监理", outcome: "顺利通过验收，获评 A 级" },
  { id: "k2", name: "岳麓区学校智慧校园建设监理", type: "服务类", amount: "520 万", date: "2024-08", place: "长沙市岳麓区", scope: "30 所学校智慧教学平台监理", outcome: "按期交付" },
  { id: "k3", name: "某市政务云平台建设", type: "工程类", amount: "1,280 万", date: "2024-05", place: "湖南", scope: "IaaS/PaaS/SaaS 三层架构", outcome: "通过等保三级测评" },
  { id: "k4", name: "某区智慧路灯采购及部署", type: "物资类", amount: "880 万", date: "2025-02", place: "湖南", scope: "5,000 杆智慧灯杆", outcome: "节能 35%" },
  { id: "k5", name: "某医院运维服务", type: "服务类", amount: "260 万/年", date: "2025-01", place: "湖南", scope: "7×24 驻场运维", outcome: "SLA 99.99%" },
  { id: "k6", name: "省级电子政务外网升级", type: "工程类", amount: "2,200 万", date: "2023-11", place: "湖南", scope: "全省 14 市州网络升级", outcome: "带宽提升 5 倍" },
];

export const mockTemplates: KbTemplate[] = [
  { id: "t1", name: "信息化项目监理服务方案", scene: "服务类", updated: "2026-05-20" },
  { id: "t2", name: "政务云平台技术方案", scene: "工程类", updated: "2026-04-10" },
  { id: "t3", name: "智慧城市硬件采购方案", scene: "物资类", updated: "2026-03-02" },
  { id: "t4", name: "运维服务总体方案", scene: "服务类", updated: "2026-02-18" },
  { id: "t5", name: "网络安全建设方案", scene: "工程类", updated: "2026-01-25" },
];

export const mockHistory: KbHistory[] = [
  { id: "h1", name: "XX区智慧路灯采购项目投标书", created: "2026-05-30" },
  { id: "h2", name: "XX医院信息化运维服务投标书", created: "2026-04-20" },
  { id: "h3", name: "省级电子政务外网升级投标书", created: "2023-11-15" },
];

export const mockCompany = {
  name: "原采智擎科技股份有限公司",
  uscc: "91440300MA5XXXXX0Q",
  business: "信息系统集成、政务云平台建设、智慧城市解决方案",
  intro:
    "公司成立于 2010 年，注册资本人民币 5,000 万元，员工 360 人，是国家高新技术企业、CMMI 3 级认证企业，长期深耕政务信息化、智慧城市、医疗信息化等领域，累计交付项目 200+ 个。",
  logo: "",
  org: "",
};
