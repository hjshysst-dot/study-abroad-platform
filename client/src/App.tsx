import { useState, useEffect } from 'react';
import { GraduationCap, DollarSign, FileText, Users, BarChart3, Wand2, Brain, TrendingUp, CheckCircle2, Globe, Briefcase, Shield, Calendar, Target, Award, MapPin, Clock, UsersRound, Globe2, ChevronRight, AlertTriangle, Scale, MessageSquare, AlertCircle, X } from 'lucide-react';

interface StudentProfile {
  // 基本信息
  name: string;
  school: string;
  major: string;
  gpa: string;
  toefl: string;
  gre: string;
  budget: string;
  target: string;
  includeLiberalArts: boolean; // 是否包含文理学院
  targetCountries: string[];
  applicationRound: string;
  careerGoal: string;
  
  // 本科申请专用
  sat: string;
  act: string;
  apCourses: string;
  apCount: string;       // AP课程数量
  honorsCourses: string;  // Honor课程数量
  extracurriculars: string; // 课外活动描述
  leadership: string;      // 领导力经历
  communityService: string; // 志愿服务时长
  awards: string;         // 竞赛奖项
  
  // 研究生申请专用
  researchExperience: string;  // 科研经历
  publications: string;        // 发表论文
  internship: string;          // 实习公司
  recommendationStrength: string; // 推荐信强度(弱/中/强)
  
  // 通用
  activities: string;
  cityPreference: string;
  safetyPriority: string;
}

// 学校数据结构
interface School {
  name: string;
  program: string;
  tuition: string;
  tuitionUSD: number;
  living: string;
  admissionRate: string;
  employmentRate: string;
  salary: string;
  category: 'reach' | 'match' | 'safety';
  rank: number;
  usNewsRank: number;
  safetyScore: string;
  optMonths: number;
  scholarship: string;
  researchFunding: string;
  careerService: string;
  h1bRate: string;
  weather: string;
  internationalPct: string;
  chinesePct: string;
  companyList: string[];
}

// 录取概率计算结果
interface AdmissionResult {
  school: School;
  admissionProbability: number;  // 0-100%
  category: 'reach' | 'match' | 'safety';
  score: number;  // 综合分数
  breakdown: {
    academic: number;
    testScore: number;
    courseRigor: number;
    activities: number;
    recommendation: number;
  };
}

interface ApplicationCheckpoint {
  id: string;
  date: string;
  title: string;
  description: string;
  completed: boolean;
  isUrgent: boolean;
}

interface CountryStrategy {
  country: string;
  flag: string;
  system: string;
  deadline: string;
  schools: { name: string; major: string; deadline: string; notes: string }[];
  requirements: string[];
  tips: string[];
}

interface OfferDecision {
  school: string;
  scholarship: number;
  careerScore: number;
  locationScore: number;
  networkScore: number;
  programScore: number;
  total: number;
}

export default function App() {
  const [applicationType, setApplicationType] = useState<'undergrad' | 'grad' | null>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'strategy' | 'timeline' | 'finder' | 'dimensions' | 'decision' | 'cost' | 'doc' | 'writing' | 'report' | 'deeptutor' | 'career'>('profile');
  const [profile, setProfile] = useState<StudentProfile>({
    // 基本信息
    name: '',
    school: '',
    major: '',
    gpa: '',
    toefl: '',
    gre: '',
    budget: '',
    target: '',
    includeLiberalArts: false, // 默认不包含文理学院
    targetCountries: ['美国'],
    applicationRound: 'ED1',
    careerGoal: '',
    
    // 本科申请专用
    sat: '',
    act: '',
    apCourses: '',
    apCount: '',
    honorsCourses: '',
    extracurriculars: '',
    leadership: '',
    communityService: '',
    awards: '',
    
    // 研究生申请专用
    researchExperience: '',
    publications: '',
    internship: '',
    recommendationStrength: '中',
    
    // 通用
    activities: '',
    cityPreference: '',
    safetyPriority: '',
  });

  // ============================================
  // 录取概率计算函数（基于《Admission Matters》+《College Admission 101》方法论）
  // 数据来源: Admission Matters (升学之道英文版) + College Admission 101 (Princeton Review)
  // ============================================
  
  // 标准化分数转换（SAT/ACT -> 1600/36分制）
  const normalizeTestScore = (sat: string, act: string): number => {
    const satScore = parseInt(sat) || 0;
    const actScore = parseFloat(act) || 0;
    if (satScore > 0) {
      return (satScore / 1600) * 100; // 转换为百分制
    }
    if (actScore > 0) {
      return (actScore / 36) * 100;
    }
    return 50; // 默认中等水平
  };
  

  // 计算本科录取概率
  const calculateUndergradProbability = (school: typeof schools[number], profile: StudentProfile): AdmissionResult => {
    const gpa = parseFloat(profile.gpa) || 3.0;
    const testScore = normalizeTestScore(profile.sat, profile.act);
    const apCount = parseInt(profile.apCount) || 0;
    const honorsCount = parseInt(profile.honorsCourses) || 0;
    const hasLeadership = profile.leadership.length > 10;
    const hasCommunityService = parseInt(profile.communityService) > 20;
    const awardsCount = profile.awards.split(',').filter(Boolean).length;
    
    // 课程难度分数（AP/IB/Honors）
    const courseRigor = Math.min(100, (apCount * 8 + honorsCount * 5 + gpa * 10));
    
    // 学术分数（GPA 35%权重）
    const academicScore = (gpa / 4.0) * 100;
    
    // 考试分数（25%权重）
    const testScoreNorm = testScore;
    
    // 课外活动分数（15%权重）
    let activityScore = 30; // 基础分
    if (hasLeadership) activityScore += 20;
    if (hasCommunityService) activityScore += 15;
    if (awardsCount > 0) activityScore += awardsCount * 10;
    if (profile.extracurriculars.length > 50) activityScore += 15;
    activityScore = Math.min(100, activityScore);
    
    // 综合分数（按《Admission Matters》权重）
    const totalScore = 
      academicScore * 0.35 +    // GPA/学术记录
      testScoreNorm * 0.25 +    // SAT/ACT
      courseRigor * 0.15 +      // 课程难度
      activityScore * 0.15 +    // 课外活动
      70 * 0.10;               // 推荐信（默认中等）
    
    // 根据学校录取率确定分类阈值
    const rate = parseFloat(school.admissionRate.replace('%', '')) || 50;
    let category: 'reach' | 'match' | 'safety';
    let probability: number;
    
    if (rate < 20) {
      // 超级选拔校（<20%录取率）
      category = 'reach';
      probability = Math.max(5, Math.min(25, totalScore * 0.3));
    } else if (rate < 35) {
      // 高选拔校（20-35%）
      if (totalScore > 75) {
        category = 'match';
        probability = Math.max(20, Math.min(50, totalScore * 0.6));
      } else {
        category = 'reach';
        probability = Math.max(10, Math.min(35, totalScore * 0.4));
      }
    } else if (rate < 50) {
      // 中等选拔校（35-50%）
      if (totalScore > 65) {
        category = 'match';
        probability = Math.max(40, Math.min(70, totalScore * 0.8));
      } else {
        category = 'reach';
        probability = Math.max(25, Math.min(45, totalScore * 0.6));
      }
    } else {
      // 匹配/保底校（>50%录取率）
      if (totalScore > 55) {
        category = 'safety';
        probability = Math.max(60, Math.min(95, totalScore + 10));
      } else {
        category = 'match';
        probability = Math.max(40, Math.min(75, totalScore));
      }
    }
    
    return {
      school,
      admissionProbability: Math.round(probability),
      category,
      score: Math.round(totalScore),
      breakdown: {
        academic: Math.round(academicScore),
        testScore: Math.round(testScoreNorm),
        courseRigor: Math.round(courseRigor),
        activities: Math.round(activityScore),
        recommendation: 70,
      }
    };
  };
  
  // 计算研究生录取概率
  const calculateGradProbability = (school: typeof schools[number], profile: StudentProfile): AdmissionResult => {
    const gpa = parseFloat(profile.gpa) || 3.0;
    const toefl = parseInt(profile.toefl) || 80;
    const gre = parseInt(profile.gre) || 310;
    const hasResearch = profile.researchExperience.length > 10;
    const hasPublication = profile.publications.length > 5;
    const internshipQuality = profile.internship.length > 10 ? 20 : 0;
    const recStrength = profile.recommendationStrength === '强' ? 85 : profile.recommendationStrength === '中' ? 70 : 50;
    
    // 科研分数（研究生最看重）
    let researchScore = 30;
    if (hasResearch) researchScore += 30;
    if (hasPublication) researchScore += 25;
    researchScore += internshipQuality;
    researchScore = Math.min(100, researchScore);
    
    // 学术分数（GPA 30%权重）
    const academicScore = (gpa / 4.0) * 100;
    
    // 语言分数（TOEFL 15%权重）
    const toeflScore = Math.min(100, (toefl / 120) * 100);
    
    // GRE分数（15%权重）
    const greScore = Math.min(100, (gre / 340) * 100);
    
    // 综合分数
    const totalScore = 
      academicScore * 0.30 +   // GPA
      researchScore * 0.25 +   // 科研经历
      toeflScore * 0.15 +      // TOEFL
      greScore * 0.15 +        // GRE
      recStrength * 0.10 +     // 推荐信
      75 * 0.05;              // 文书（默认）
    
    // 研究生学校通常录取率更低
    const rate = parseFloat(school.admissionRate.replace('%', '')) || 30;
    let category: 'reach' | 'match' | 'safety';
    let probability: number;
    
    if (rate < 15) {
      category = 'reach';
      probability = Math.max(3, Math.min(20, totalScore * 0.25));
    } else if (rate < 30) {
      if (totalScore > 70) {
        category = 'match';
        probability = Math.max(15, Math.min(45, totalScore * 0.55));
      } else {
        category = 'reach';
        probability = Math.max(8, Math.min(30, totalScore * 0.35));
      }
    } else if (rate < 50) {
      if (totalScore > 60) {
        category = 'match';
        probability = Math.max(35, Math.min(65, totalScore * 0.75));
      } else {
        category = 'reach';
        probability = Math.max(20, Math.min(50, totalScore * 0.6));
      }
    } else {
      if (totalScore > 50) {
        category = 'safety';
        probability = Math.max(55, Math.min(90, totalScore + 15));
      } else {
        category = 'match';
        probability = Math.max(35, Math.min(70, totalScore));
      }
    }
    
    return {
      school,
      admissionProbability: Math.round(probability),
      category,
      score: Math.round(totalScore),
      breakdown: {
        academic: Math.round(academicScore),
        testScore: Math.round((toeflScore + greScore) / 2),
        courseRigor: Math.round(researchScore),
        activities: Math.round(researchScore),
        recommendation: recStrength,
      }
    };
  };
  const [isGenerating, setIsGenerating] = useState(false);
  const [report, setReport] = useState('');
  const [selectedExperts, setSelectedExperts] = useState<string[]>(['zhangxuefeng']);
  const [selectedDimensions, setSelectedDimensions] = useState<string[]>(['ranking', 'employment', 'cost', 'safety', 'opt']);

  // 动态推荐学校列表（基于学生条件计算）
  const [recommendedSchools, setRecommendedSchools] = useState<AdmissionResult[]>([]);
  
  // 生成动态选校推荐
  const generateRecommendations = (type: 'undergrad' | 'grad') => {
    const results = schools.map(school => {
      if (type === 'undergrad') {
        return calculateUndergradProbability(school, profile);
      } else {
        return calculateGradProbability(school, profile);
      }
    });
    
    // 按录取概率排序
    results.sort((a, b) => b.admissionProbability - a.admissionProbability);
    
    // 分类展示
    const reach = results.filter(r => r.category === 'reach').slice(0, 6);
    const match = results.filter(r => r.category === 'match').slice(0, 8);
    const safety = results.filter(r => r.category === 'safety').slice(0, 4);
    
    setRecommendedSchools([...reach, ...match, ...safety]);
  };

  // 页面完成状态跟踪
  const [pageCompletion, setPageCompletion] = useState({
    profile: false,
    strategy: false,
    timeline: false,
    finder: false,
    dimensions: false,
    decision: false,
    cost: false,
    doc: false,
    writing: false,
    deeptutor: false,
    career: false,
    report: false,
  });

  // 当用户进入"多国策略"页面时，自动标记为完成以解锁后续页面
  useEffect(() => {
    if (activeTab === 'strategy' && !pageCompletion.strategy) {
      setPageCompletion(prev => ({ ...prev, strategy: true }));
    }
  }, [activeTab]);

  // 学生信息提交记录
  const [showHistory, setShowHistory] = useState(false);
  const [submissions, setSubmissions] = useState<Array<{id: string; date: string; data: StudentProfile; type: 'undergrad' | 'grad'}>>(() => {
    try {
      const saved = localStorage.getItem('studentSubmissions');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  // 保存提交记录到localStorage
  const saveSubmission = (profileData: StudentProfile, appType: 'undergrad' | 'grad') => {
    const newSubmission = {
      id: Date.now().toString(),
      date: new Date().toLocaleString('zh-CN'),
      data: profileData,
      type: appType,
    };
    const updated = [newSubmission, ...submissions].slice(0, 50); // 最多保存50条
    setSubmissions(updated);
    localStorage.setItem('studentSubmissions', JSON.stringify(updated));
  };

  // 页面锁定检查
  const isPageLocked = (pageId: string) => {
    const dependencies: Record<string, string[]> = {
      strategy: ['profile'],
      timeline: ['strategy'],
      finder: ['strategy'],
      dimensions: ['finder'],
      decision: ['dimensions'],
      cost: ['strategy'],
    };
    return dependencies[pageId]?.some(dep => !(pageCompletion as any)[dep]) ?? false;
  };

  // 获取锁定提示信息
  const getLockMessage = (pageId: string) => {
    const lockMessages: Record<string, string> = {
      strategy: '学生信息',
      timeline: '多国策略',
      finder: '多国策略',
      dimensions: '大学查找',
      decision: '选校维度',
      cost: '多国策略',
    };
    return lockMessages[pageId] || '前置页面';
  };

  // New state for strategy and timeline
  const [checkpoints, setCheckpoints] = useState<ApplicationCheckpoint[]>([
    { id: 'cp1', date: '2025.06', title: '选校确认', description: '确认最终申请学校List，签约中介或确定独立申请', completed: false, isUrgent: true },
    { id: 'cp2', date: '2025.07', title: '文书初稿', description: '完成主文书第一稿，开始头脑风暴3个核心故事', completed: false, isUrgent: true },
    { id: 'cp3', date: '2025.08', title: '附加文书', description: '完成EA/ED学校附加文书（Why school等）', completed: false, isUrgent: true },
    { id: 'cp4', date: '2025.09', title: '推荐信', description: '联系推荐人，确认推荐信老师人选', completed: false, isUrgent: false },
    { id: 'cp5', date: '2025.10.01', title: 'ED提交', description: 'ED学校提交申请（建议提前15天）', completed: false, isUrgent: true },
    { id: 'cp6', date: '2025.11.01', title: 'EA提交', description: 'EA学校提交申请', completed: false, isUrgent: true },
    { id: 'cp7', date: '2025.12', title: 'ED/EA放榜', description: '关注ED/EA录取结果，准备RD文书', completed: false, isUrgent: false },
    { id: 'cp8', date: '2026.01.01', title: 'RD提交', description: 'RD学校提交申请（最后截止）', completed: false, isUrgent: true },
    { id: 'cp9', date: '2026.03-04', title: 'RD放榜', description: '收到RD录取结果，做出最终选择', completed: false, isUrgent: false },
    { id: 'cp10', date: '2026.05.01', title: 'Offer选择', description: 'National Reply Date，选择offer并交押金', completed: false, isUrgent: true },
  ]);

  const [countryStrategies] = useState<CountryStrategy[]>([
    {
      country: '美国',
      flag: '🇺🇸',
      system: 'Common App / Coalition / UC独立',
      deadline: 'ED: 11/1 | EA: 11/1 | RD: 1/1-15',
      schools: [
        { name: 'MIT', major: 'CS/EECS', deadline: 'EA 11/1', notes: '附加2道题' },
        { name: 'Stanford', major: 'CS', deadline: 'RA 1/2', notes: '附加文书' },
        { name: 'CMU', major: 'CS', deadline: 'ED 11/1', notes: 'CS学院单独审核' },
        { name: 'Cornell', major: 'Engineering', deadline: 'ED 11/1', notes: '工程Essay' },
        { name: 'Berkeley', major: 'EECS', deadline: '11/30', notes: '州外竞争激烈' },
      ],
      requirements: ['SAT/ACT', 'TOEFL 100+', 'AP 3-5门', '推荐信 x 3', '主文书', '附加文书'],
      tips: ['CS强校需额外编程作品集', 'ED录取率约为RD的2倍', '理工科建议提交SAT2']
    },
    {
      country: '加拿大',
      flag: '🇨🇦',
      system: 'OUAC (安省) / 学校直申',
      deadline: '1/15-2/3',
      schools: [
        { name: '多伦多大学', major: 'Engineering/CS', deadline: '1/15', notes: '附加文书/面试' },
        { name: 'UBC', major: 'Engineering', deadline: '12/1', notes: '工程热门' },
        { name: 'McGill', major: 'Engineering', deadline: '1/15', notes: '法语区' },
        { name: 'Waterloo', major: 'CS/Engineering', deadline: '2/3', notes: 'Co-op项目极好' },
      ],
      requirements: ['SAT/ACT可选', 'IELTS 6.5+', 'IB成绩单', '附加文书(部分)'],
      tips: ['Waterloo Co-op是北美最大合作教育', '工程专业需IB数学/物理高分', '部分省可走省提名移民']
    },
    {
      country: '英国',
      flag: '🇬🇧',
      system: 'UCAS (最多5所)',
      deadline: '牛剑: 10/15 | 常规: 1/29',
      schools: [
        { name: '剑桥大学', major: 'Engineering', deadline: '10/15', notes: 'ENGAA考试+面试' },
        { name: '牛津大学', major: 'Engineering', deadline: '10/15', notes: 'MAT/PAT考试+面试' },
        { name: 'IC', major: 'Engineering', deadline: '1/29', notes: '工程英国第一' },
        { name: 'UCL', major: 'CS/Engineering', deadline: '1/29', notes: '附加考试建议' },
      ],
      requirements: ['A-Level AAA-A*AA', 'IELTS 7.0+', 'Personal Statement 4000字符', '附加考试(MAT/PAT/STEP)'],
      tips: ['牛剑只能二选一', 'PS是核心竞争要素', 'IB 40+可申剑桥/IC']
    },
    {
      country: '香港',
      flag: '🇭🇰',
      system: 'JUPAS / 国际生直招',
      deadline: '3月(国际生)',
      schools: [
        { name: '港大', major: 'Engineering', deadline: '12/28', notes: 'QS前30' },
        { name: '港科大', major: 'Engineering', deadline: '1/3', notes: '就业率最高' },
        { name: '港中文', major: 'Engineering', deadline: '1/2', notes: '工程院规模大' },
      ],
      requirements: ['SAT 1450+', 'IELTS 6.5+', 'IB成绩单', '面试'],
      tips: ['英语教学', 'HKUST有海外交换机会', '本地就业/深造双通道']
    },
    {
      country: '新加坡',
      flag: '🇸🇬',
      system: 'NUS/NTU/SMU独立申请',
      deadline: '2/28-3/15',
      schools: [
        { name: 'NUS', major: 'Engineering', deadline: '2/28', notes: '亚洲QS最高' },
        { name: 'NTU', major: 'Engineering', deadline: '3/15', notes: '研究型项目丰富' },
      ],
      requirements: ['SAT 1450+', 'IELTS 7.0+', 'IB成绩单', '面试/笔试'],
      tips: ['性价比高于英美', '毕业留新政策友好', '雅思7分是竞争力门槛']
    },
  ]);

  const [conflictScenarios] = useState([
    {
      scenario: '美国ED录取 vs 其他国家offer',
      strategy: [
        { step: 1, action: '立刻通知其他国家学校，附上ED录取协议' },
        { step: 2, action: '英国：发邮件给UCAS申请defer或撤换为保底校' },
        { step: 3, action: '加拿大：联系OUAC或学校说明情况，请求优先处理' },
        { step: 4, action: '港澳新：发邮件给招生办说明ED冲突，请求加速出结果' },
      ],
      note: 'ED是绑定协议，违约会损害大学信用'
    },
    {
      scenario: '英国牛剑offer vs 美国ED录取',
      strategy: [
        { step: 1, action: '先接受ED，同时在UCAS保留offer（5月前仍可决定）' },
        { step: 2, action: '5月拿到牛剑offer后：选择去哪所' },
        { step: 3, action: 'ED校可申请release（需书面说明）' },
      ],
      note: '牛剑offer通常5月才发，ED在12月-2月就出了'
    },
  ]);

  const [decisionOffers, setDecisionOffers] = useState<OfferDecision[]>([
    { school: '沃顿 (Penn)', scholarship: 0, careerScore: 95, locationScore: 80, networkScore: 95, programScore: 90, total: 0 },
    { school: 'MIT斯隆', scholarship: 0, careerScore: 90, locationScore: 85, networkScore: 90, programScore: 92, total: 0 },
    { school: '伯克利哈斯', scholarship: 0, careerScore: 85, locationScore: 95, networkScore: 75, programScore: 85, total: 0 },
  ]);

  const [edSchool, setEdSchool] = useState('CMU');
  const [eaSchool, setEaSchool] = useState('密歇根');
  const [selectedTargetCountries, setSelectedTargetCountries] = useState(['美国', '加拿大', '英国']);

  const toggleCheckpoint = (id: string) => {
    setCheckpoints(checkpoints.map(cp => cp.id === id ? { ...cp, completed: !cp.completed } : cp));
  };

  const calculateOfferScores = () => {
    setDecisionOffers(offers => offers.map(offer => ({
      ...offer,
      total: Math.round(offer.careerScore * 0.3 + offer.locationScore * 0.2 + offer.scholarship * 0.2 + offer.programScore * 0.15 + offer.networkScore * 0.15)
    })));
  };

  const experts = [
    { id: 'zhangxuefeng', name: '张雪峰', style: '就业导向、性价比优先' },
    { id: 'liuxuge', name: '留学顾问', style: '专业选校、申请策略' },
    { id: 'admission', name: '招生官', style: '录取逻辑、审核视角' },
    { id: 'baoshu', name: '暴叔讲留学', style: '出路信心、实用主义' },
  ];

  const dimensions = [
    { id: 'ranking', name: '综合/专业排名', icon: Target, desc: 'QS/USNEWS/THE排名' },
    { id: 'employment', name: '毕业生就业率', icon: Briefcase, desc: '毕业6个月就业比例' },
    { id: 'salary', name: '平均起薪', icon: DollarSign, desc: '各专业毕业生薪资' },
    { id: 'cost', name: '学费/生活费', icon: DollarSign, desc: '年度费用明细' },
    { id: 'scholarship', name: '奖学金机会', icon: Award, desc: 'TA/RA/Fellowship' },
    { id: 'safety', name: '城市安全度', icon: Shield, desc: 'Niche安全评分' },
    { id: 'opt', name: 'OPT/CPT政策', icon: Clock, desc: '实习工作许可' },
    { id: 'h1b', name: 'H1B中签率', icon: Globe, desc: '工作签证概率' },
    { id: 'career', name: 'Career Service', icon: Briefcase, desc: '职业服务中心' },
    { id: 'location', name: '地理位置', icon: MapPin, desc: '城市/气候/交通' },
    { id: 'research', name: '科研资源', icon: Award, desc: '实验室/经费' },
    { id: 'intl', name: '国际化程度', icon: UsersRound, desc: '国际学生比例' },
  ];

  const schools = [
    { name: 'Stanford', program: 'MS CS', tuition: '$68K/年', tuitionUSD: 68000, living: '$25K/年', admissionRate: '5%', employmentRate: '98%', salary: '$180K', category: 'reach' as const, rank: 1, usNewsRank: 3, safetyScore: 'A+', optMonths: 36, scholarship: '难申请', researchFunding: '充足', careerService: '极好', h1bRate: '高', weather: '地中海气候', internationalPct: '25%', chinesePct: '8%', companyList: ['Google', 'Apple', 'Meta', 'NVIDIA'] },
    { name: 'MIT', program: 'MS EECS', tuition: '$60K/年', tuitionUSD: 60000, living: '$22K/年', admissionRate: '8%', employmentRate: '96%', salary: '$160K', category: 'reach' as const, rank: 2, usNewsRank: 2, safetyScore: 'A+', optMonths: 36, scholarship: '难申请', researchFunding: '极充足', careerService: '极好', h1bRate: '高', weather: '温带大陆性', internationalPct: '30%', chinesePct: '10%', companyList: ['SpaceX', 'Google', 'Microsoft', 'Apple'] },
    { name: 'CMU', program: 'MS ECE', tuition: '$52K/年', tuitionUSD: 52000, living: '$18K/年', admissionRate: '30%', employmentRate: '95%', salary: '$130K', category: 'reach' as const, rank: 4, usNewsRank: 22, safetyScore: 'A', optMonths: 36, scholarship: '部分可申请', researchFunding: '充足', careerService: '极好', h1bRate: '高', weather: '温带大陆性', internationalPct: '40%', chinesePct: '20%', companyList: ['Google', 'Meta', 'Apple', 'Uber'] },
    { name: 'UIUC', program: 'MS CS', tuition: '$38K/年', tuitionUSD: 38000, living: '$14K/年', admissionRate: '35%', employmentRate: '92%', salary: '$110K', category: 'match' as const, rank: 15, usNewsRank: 35, safetyScore: 'A-', optMonths: 36, scholarship: '优秀者可免', researchFunding: '极充足', careerService: '好', h1bRate: '中', weather: '温带大陆性', internationalPct: '25%', chinesePct: '15%', companyList: ['Microsoft', 'Google', 'Amazon', 'Meta'] },
    { name: 'GaTech', program: 'MS CS', tuition: '$38K/年', tuitionUSD: 38000, living: '$16K/年', admissionRate: '32%', employmentRate: '94%', salary: '$115K', category: 'match' as const, rank: 10, usNewsRank: 33, safetyScore: 'B+', optMonths: 36, scholarship: '部分可申请', researchFunding: '充足', careerService: '极好', h1bRate: '中', weather: '亚热带气候', internationalPct: '28%', chinesePct: '12%', companyList: ['Delta', 'Home Depot', 'Coca-Cola', 'Google'] },
    { name: 'UT Austin', program: 'MS CS', tuition: '$38K/年', tuitionUSD: 38000, living: '$15K/年', admissionRate: '50%', employmentRate: '90%', salary: '$105K', category: 'match' as const, rank: 20, usNewsRank: 38, safetyScore: 'B', optMonths: 36, scholarship: '优秀者可免', researchFunding: '充足', careerService: '好', h1bRate: '中', weather: '亚热带气候', internationalPct: '15%', chinesePct: '5%', companyList: ['Dell', 'HP', 'Texas Instruments', 'Apple'] },
    { name: 'Purdue', program: 'MS ECE', tuition: '$35K/年', tuitionUSD: 35000, living: '$14K/年', admissionRate: '65%', employmentRate: '88%', salary: '$100K', category: 'safety' as const, rank: 25, usNewsRank: 43, safetyScore: 'A-', optMonths: 36, scholarship: 'TA/RA机会多', researchFunding: '极充足', careerService: '好', h1bRate: '中', weather: '温带大陆性', internationalPct: '25%', chinesePct: '12%', companyList: ['John Deere', 'Caterpillar', 'Google', 'Microsoft'] },
    { name: 'UW-Madison', program: 'MS CS', tuition: '$40K/年', tuitionUSD: 40000, living: '$14K/年', admissionRate: '60%', employmentRate: '89%', salary: '$98K', category: 'safety' as const, rank: 30, usNewsRank: 39, safetyScore: 'A-', optMonths: 36, scholarship: '部分可申请', researchFunding: '充足', careerService: '好', h1bRate: '中低', weather: '温带大陆性', internationalPct: '18%', chinesePct: '8%', companyList: ['Epic', 'Microsoft', 'Google', 'Amazon'] },
  ];

  const generateReport = async () => {
    setIsGenerating(true);
    
    try {
      console.log('🔄 开始调用AI生成报告...');
      
      // 调用后端AI API
      const response = await fetch('/api/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile,
          applicationType: applicationType || 'undergrad'
        })
      });
      
      if (!response.ok) {
        throw new Error(`API响应错误: ${response.status}`);
      }
      
      const aiResult = await response.json();
      console.log('✅ AI报告生成成功', aiResult.success ? '(真实AI)' : '(fallback)');
      
      // 如果AI返回了结构化数据，转为Markdown报告
      if (aiResult.success && aiResult.data && !aiResult.data.raw) {
        const d = aiResult.data;
        const studentName = d.student?.name || profile.name || '学生';
        
        let result = '# 🎯 留学选校报告 - ' + studentName + '\n\n';
        
        // 学生背景
        if (d.student) {
          result += '## 📋 学生背景\n\n';
          result += '| 项目 | 数据 |\n|------|------|\n';
          result += '| 姓名 | ' + (d.student.name || '-') + ' |\n';
          result += '| 学校 | ' + (d.student.school || '-') + ' |\n';
          result += '| 专业 | ' + (d.student.major || '-') + ' |\n';
          result += '| GPA | ' + (d.student.gpa || '-') + ' |\n';
          result += '| TOEFL | ' + (d.student.toefl || '-') + ' |\n';
          result += '| 目标国家 | ' + ((d.student.targetCountries || []).join('、')) + ' |\n';
          result += '| 目标专业 | ' + (d.student.targetMajor || '-') + ' |\n\n';
        }
        
        // 整体评估
        if (d.summary) {
          result += '## 📊 整体评估\n' + d.summary + '\n\n';
        }
        
        // 冲刺档
        if (d.reach && d.reach.length > 0) {
          result += '## 🔥 冲刺档（录取率<35%）\n';
          result += '| 学校 | 国家 | 排名 | 录取率 | 学费/年 | 亮点 |\n';
          result += '|------|------|------|--------|--------|------|\n';
          d.reach.forEach(s => {
            result += '| ' + s.name + ' | ' + s.country + ' | ' + s.rank + ' | ' + s.admissionRate + ' | ' + s.tuition + ' | ' + ((s.highlights || [])[0] || '-') + ' |\n';
          });
          result += '\n';
        }
        
        // 匹配档
        if (d.match && d.match.length > 0) {
          result += '## ✅ 匹配档（录取率35-60%）\n';
          result += '| 学校 | 国家 | 排名 | 录取率 | 学费/年 | 亮点 |\n';
          result += '|------|------|------|--------|--------|------|\n';
          d.match.forEach(s => {
            result += '| ' + s.name + ' | ' + s.country + ' | ' + s.rank + ' | ' + s.admissionRate + ' | ' + s.tuition + ' | ' + ((s.highlights || [])[0] || '-') + ' |\n';
          });
          result += '\n';
        }
        
        // 保底档
        if (d.safety && d.safety.length > 0) {
          result += '## 🛡️ 保底档（录取率>60%）\n';
          result += '| 学校 | 国家 | 排名 | 录取率 | 学费/年 | 亮点 |\n';
          result += '|------|------|------|--------|--------|------|\n';
          d.safety.forEach(s => {
            result += '| ' + s.name + ' | ' + s.country + ' | ' + s.rank + ' | ' + s.admissionRate + ' | ' + s.tuition + ' | ' + ((s.highlights || [])[0] || '-') + ' |\n';
          });
          result += '\n';
        }
        
        // 申请策略
        if (d.strategy) {
          result += '## 📅 申请策略\n';
          if (d.strategy.ed) result += '- **ED1**: ' + d.strategy.ed + '\n';
          if (d.strategy.ea) result += '- **EA**: ' + d.strategy.ea + '\n';
          if (d.strategy.rd) result += '- **RD**: ' + d.strategy.rd + '\n';
          if (d.strategy.notes) result += '\n' + d.strategy.notes + '\n';
          result += '\n';
        }
        
        // 时间线
        if (d.timeline) {
          result += '## ⏰ 申请时间线\n';
          if (d.timeline.fall) result += '- 今年秋季: ' + d.timeline.fall + '\n';
          if (d.timeline.spring) result += '- 次年春季: ' + d.timeline.spring + '\n';
          result += '\n';
        }
        
        // 注意事项
        if (d.warnings && d.warnings.length > 0) {
          result += '## ⚠️ 注意事项\n';
          d.warnings.forEach(w => { result += '- ' + w + '\n'; });
          result += '\n';
        }
        
        result += '---\n';
        result += '*🤖 AI生成 | 数据来源：OpenAI GPT-4o mini*\n';
        result += '*生成时间：' + new Date().toLocaleDateString('zh-CN') + '*\n';
        
        setReport(result);
      } else if (aiResult.data?.raw) {
        // 直接显示AI返回的原始文本
        setReport(aiResult.data.raw);
      } else {
        // fallback: 使用内置mock数据
        console.log('⚠️ AI返回格式异常，使用Mock数据');
        throw new Error('AI返回格式异常');
      }
      
    } catch (error) {
      console.error('❌ AI生成失败:', error.message);
      console.log('📦 使用Mock数据作为Fallback');
      
      // Fallback: 使用内置mock数据
      const budgetNum = parseInt(profile.budget) || 80;
      let result = '# 🎯 留学选校报告 - ' + (profile.name || '学生') + '\n\n';
      result += '## 📋 学生背景\n\n';
      result += '| 项目 | 数据 |\n|------|------|\n';
      result += '| 姓名 | ' + (profile.name || '待填写') + ' |\n';
      result += '| 学校 | ' + (profile.school || '待填写') + ' |\n';
      result += '| GPA | ' + (profile.gpa || '待填写') + ' |\n';
      result += '| TOEFL | ' + (profile.toefl || '待填写') + ' |\n';
      result += '| 目标国家 | ' + ((profile.targetCountries || ['美国']).join('、')) + ' |\n';
      result += '| 预算 | ' + budgetNum + '万人民币/年 |\n\n';
      
      const reachSchools = schools.filter(s => s.category === 'reach');
      const matchSchools = schools.filter(s => s.category === 'match');
      const safetySchools = schools.filter(s => s.category === 'safety');
      
      if (reachSchools.length > 0) {
        result += '## 🔥 冲刺档（录取率<35%）\n';
        result += '| 学校 | USNEWS | 录取率 | 就业率 | 起薪 | 学费/年 |\n';
        result += '|------|--------|--------|--------|--------|--------|\n';
        reachSchools.forEach(s => {
          result += '| ' + s.name + ' | ' + s.usNewsRank + ' | ' + s.admissionRate + ' | ' + s.employmentRate + ' | ' + s.salary + ' | ' + s.tuition + ' |\n';
        });
        result += '\n';
      }
      
      if (matchSchools.length > 0) {
        result += '## ✅ 匹配档（录取率35-60%）\n';
        result += '| 学校 | USNEWS | 录取率 | 就业率 | 起薪 | 学费/年 |\n';
        result += '|------|--------|--------|--------|--------|--------|\n';
        matchSchools.forEach(s => {
          result += '| ' + s.name + ' | ' + s.usNewsRank + ' | ' + s.admissionRate + ' | ' + s.employmentRate + ' | ' + s.salary + ' | ' + s.tuition + ' |\n';
        });
        result += '\n';
      }
      
      if (safetySchools.length > 0) {
        result += '## 🛡️ 保底档（录取率>60%）\n';
        result += '| 学校 | USNEWS | 录取率 | 就业率 | 起薪 | 学费/年 |\n';
        result += '|------|--------|--------|--------|--------|--------|\n';
        safetySchools.forEach(s => {
          result += '| ' + s.name + ' | ' + s.usNewsRank + ' | ' + s.admissionRate + ' | ' + s.employmentRate + ' | ' + s.salary + ' | ' + s.tuition + ' |\n';
        });
        result += '\n';
      }
      
      result += '---\n';
      result += '*⚠️ Mock数据（AI服务暂不可用）*\n';
      result += '*生成时间：' + new Date().toLocaleDateString('zh-CN') + '*\n';
      
      setReport(result);
    }
    
    setIsGenerating(false);
    // 保存提交记录
    saveSubmission(profile, applicationType || 'undergrad');
    // 标记profile为完成并跳转strategy
    setPageCompletion(prev => ({ ...prev, profile: true }));
    // 同步目标国家到strategy
    setSelectedTargetCountries(profile.targetCountries.length > 0 ? profile.targetCountries : ['美国']);
    setActiveTab('strategy');
  };

  const tabs = [
    // 主流程（按顺序）
    { id: 'profile', label: '学生信息', icon: Users, flow: 'main' },
    { id: 'strategy', label: '多国策略', icon: Globe2, flow: 'main' },
    { id: 'timeline', label: '申请时间轴', icon: Calendar, flow: 'main' },
    { id: 'finder', label: '大学查找', icon: GraduationCap, flow: 'main' },
    { id: 'dimensions', label: '选校维度', icon: Target, flow: 'main' },
    { id: 'decision', label: 'Offer决策', icon: Scale, flow: 'main' },
    { id: 'cost', label: '费用计算', icon: DollarSign, flow: 'main' },
    { id: 'doc', label: '材料清单', icon: FileText, flow: 'main' },
    { id: 'writing', label: '文书助手', icon: Wand2, flow: 'main' },
    // 独立Tab
    { id: 'deeptutor', label: 'DeepTutor', icon: Brain, flow: 'independent' },
    { id: 'career', label: 'Future Planning', icon: TrendingUp, flow: 'independent' },
    { id: 'report', label: '报告', icon: BarChart3, flow: 'independent' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">留学Agent平台 v2.1</h1>
                <p className="text-sm text-gray-500">多国申请 x 时间轴 x Offer决策</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowHistory(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-full hover:bg-blue-100 transition-all"
              >
                <Clock className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-600">历史记录 ({submissions.length})</span>
              </button>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 rounded-full">
                <Brain className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-600">AI-Powered</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-full">
                <Globe className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-600">5国申请</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map(tab => {
              const locked = isPageLocked(tab.id);
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    if (locked) {
                      alert('请先完成【' + getLockMessage(tab.id) + '】页面');
                      return;
                    }
                    setActiveTab(tab.id as any);
                  }}
                  className={`flex items-center gap-2 px-3 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                    isActive
                      ? 'border-blue-600 text-blue-600 bg-blue-50'
                      : locked
                      ? 'border-transparent text-gray-400 cursor-not-allowed opacity-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                  {locked && <Shield className="w-3 h-3 text-gray-400" />}
                  {pageCompletion[tab.id as keyof typeof pageCompletion] && !locked && <CheckCircle2 className="w-3 h-3 text-green-500" />}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* ========== 学生信息 Tab ========== */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            {/* Application Type Selection */}
            {applicationType === null && (
              <div className="bg-white rounded-2xl shadow-sm p-8">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  选择你的申请类型
                </h2>
                <div className="grid grid-cols-2 gap-6">
                  <button
                    onClick={() => setApplicationType('undergrad')}
                    className="p-8 border-2 border-blue-200 rounded-2xl hover:border-blue-500 hover:bg-blue-50 transition-all text-left group"
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <GraduationCap className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">🎓 本科申请</h3>
                    <p className="text-gray-500 text-sm mb-3">for high school graduates</p>
                    <p className="text-sm text-gray-600">国际高中 / 国内高中毕业生<br/>申请大学本科</p>
                  </button>
                  <button
                    onClick={() => setApplicationType('grad')}
                    className="p-8 border-2 border-purple-200 rounded-2xl hover:border-purple-500 hover:bg-purple-50 transition-all text-left group"
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Award className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">🎓 研究生申请</h3>
                    <p className="text-gray-500 text-sm mb-3">for college graduates</p>
                    <p className="text-sm text-gray-600">本科在读 / 已毕业<br/>考研 / 出国读研</p>
                  </button>
                </div>
              </div>
            )}

            {/* Undergrad Profile Form */}
            {applicationType === 'undergrad' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-sm p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-blue-600" />
                      本科申请 - 学生信息
                    </h2>
                    <button
                      onClick={() => setApplicationType(null)}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      ← 重新选择
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">姓名</label>
                      <input 
                        type="text" 
                        value={profile.name}
                        onChange={e => setProfile({...profile, name: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="请输入姓名"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">高中学校</label>
                      <input 
                        type="text" 
                        value={profile.school}
                        onChange={e => setProfile({...profile, school: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="如：南京外国语学校"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">意向专业</label>
                      <input 
                        type="text" 
                        value={profile.major}
                        onChange={e => setProfile({...profile, major: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="如：计算机科学"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">GPA</label>
                      <input 
                        type="text" 
                        value={profile.gpa}
                        onChange={e => setProfile({...profile, gpa: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="如：3.8/4.0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">SAT</label>
                      <input 
                        type="text" 
                        value={profile.sat}
                        onChange={e => setProfile({...profile, sat: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="如：1530"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">ACT</label>
                      <input 
                        type="text" 
                        value={profile.act}
                        onChange={e => setProfile({...profile, act: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="如：34"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">TOEFL</label>
                      <input 
                        type="text" 
                        value={profile.toefl}
                        onChange={e => setProfile({...profile, toefl: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="如：105"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">AP课程数量</label>
                      <input 
                        type="text" 
                        value={profile.apCount}
                        onChange={e => setProfile({...profile, apCount: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="如：4"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Honor课程数量</label>
                      <input 
                        type="text" 
                        value={profile.honorsCourses}
                        onChange={e => setProfile({...profile, honorsCourses: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="如：3"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">AP课程(详细)</label>
                      <input 
                        type="text" 
                        value={profile.apCourses}
                        onChange={e => setProfile({...profile, apCourses: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="如：CS(5), Calculus BC(5)"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">预算（万人民币）</label>
                      <input 
                        type="text" 
                        value={profile.budget}
                        onChange={e => setProfile({...profile, budget: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="如：80"
                      />
                    </div>
                    <div className="col-span-3">
                      <label className="block text-sm font-medium text-gray-700 mb-2">目标国家</label>
                      <div className="flex flex-wrap gap-2 pt-2">
                        {['美国', '加拿大', '英国', '香港', '新加坡', '澳大利亚'].map(c => (
                          <label key={c} className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg hover:bg-blue-50 cursor-pointer">
                            <input 
                              type="checkbox"
                              checked={profile.targetCountries.includes(c)}
                              onChange={e => {
                                if (e.target.checked) {
                                  setProfile({...profile, targetCountries: [...profile.targetCountries, c]});
                                } else {
                                  setProfile({...profile, targetCountries: profile.targetCountries.filter(t => t !== c)});
                                }
                              }}
                              className="w-4 h-4 text-blue-600"
                            />
                            <span className="text-sm">{c}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    {/* 文理学院勾选项 */}
                    <div className="col-span-3">
                      <label className="block text-sm font-medium text-gray-700 mb-2">选校偏好</label>
                      <label className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg hover:bg-blue-50 cursor-pointer bg-gray-50">
                        <input 
                          type="checkbox"
                          checked={profile.includeLiberalArts}
                          onChange={e => {
                            setProfile({...profile, includeLiberalArts: e.target.checked});
                          }}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="text-sm">包含文理学院 (Liberal Arts College)</span>
                      </label>
                      <p className="text-xs text-gray-500 mt-1">默认不勾选，中国学生普遍更倾向于申请综合性大学</p>
                    </div>
                    <div className="col-span-3">
                      <label className="block text-sm font-medium text-gray-700 mb-2">背景活动（实习/竞赛/科研）</label>
                      <textarea 
                        value={profile.activities}
                        onChange={e => setProfile({...profile, activities: e.target.value})}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="请描述您的实习、竞赛、科研等经历"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm p-8">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Brain className="w-5 h-5 text-purple-600" />
                    女娲思维蒸馏选择
                  </h2>
                  <p className="text-sm text-gray-500 mb-4">选择顾问视角，生成个性化建议</p>
                  <div className="flex flex-wrap gap-3">
                    {experts.map(exp => (
                      <button
                        key={exp.id}
                        onClick={() => {
                          if (selectedExperts.includes(exp.id)) {
                            setSelectedExperts(selectedExperts.filter(e => e !== exp.id));
                          } else {
                            setSelectedExperts([...selectedExperts, exp.id]);
                          }
                        }}
                        className={'px-5 py-3 rounded-xl border-2 transition-all ' + (selectedExperts.includes(exp.id) ? 'border-purple-600 bg-purple-50 text-purple-700' : 'border-gray-200 text-gray-600 hover:border-gray-300')}
                      >
                        <span className="font-medium">{exp.name}</span>
                        <span className="text-xs ml-2 opacity-60">({exp.style})</span>
                      </button>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={generateReport}
                  disabled={isGenerating}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      女娲+达尔文+12维度协作生成中...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-5 h-5" />
                      继续下一页
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Grad Profile Form */}
            {applicationType === 'grad' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-sm p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                      <Award className="w-5 h-5 text-purple-600" />
                      研究生申请 - 学生信息
                    </h2>
                    <button
                      onClick={() => setApplicationType(null)}
                      className="text-sm text-purple-600 hover:underline"
                    >
                      ← 重新选择
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">姓名</label>
                      <input 
                        type="text" 
                        value={profile.name}
                        onChange={e => setProfile({...profile, name: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                        placeholder="请输入姓名"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">本科学校</label>
                      <input 
                        type="text" 
                        value={profile.school}
                        onChange={e => setProfile({...profile, school: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                        placeholder="如：南京大学"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">本科专业</label>
                      <input 
                        type="text" 
                        value={profile.major}
                        onChange={e => setProfile({...profile, major: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                        placeholder="如：计算机科学"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">GPA</label>
                      <input 
                        type="text" 
                        value={profile.gpa}
                        onChange={e => setProfile({...profile, gpa: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                        placeholder="如：3.6/4.0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">GRE</label>
                      <input 
                        type="text" 
                        value={profile.gre}
                        onChange={e => setProfile({...profile, gre: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                        placeholder="如：328"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">TOEFL/IELTS</label>
                      <input 
                        type="text" 
                        value={profile.toefl}
                        onChange={e => setProfile({...profile, toefl: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                        placeholder="如：105（托福）/ 7.5（雅思）"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">预算（万人民币）</label>
                      <input 
                        type="text" 
                        value={profile.budget}
                        onChange={e => setProfile({...profile, budget: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                        placeholder="如：80"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">意向研究方向</label>
                      <input 
                        type="text" 
                        value={profile.careerGoal}
                        onChange={e => setProfile({...profile, careerGoal: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                        placeholder="如：人工智能、机器学习"
                      />
                    </div>
                    <div className="col-span-3">
                      <label className="block text-sm font-medium text-gray-700 mb-2">目标国家</label>
                      <div className="flex flex-wrap gap-2 pt-2">
                        {['美国', '加拿大', '英国', '香港', '新加坡', '澳大利亚'].map(c => (
                          <label key={c} className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg hover:bg-purple-50 cursor-pointer">
                            <input 
                              type="checkbox"
                              checked={profile.targetCountries.includes(c)}
                              onChange={e => {
                                if (e.target.checked) {
                                  setProfile({...profile, targetCountries: [...profile.targetCountries, c]});
                                } else {
                                  setProfile({...profile, targetCountries: profile.targetCountries.filter(t => t !== c)});
                                }
                              }}
                              className="w-4 h-4 text-purple-600"
                            />
                            <span className="text-sm">{c}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    {/* 文理学院勾选项 - 研究生版 */}
                    <div className="col-span-3">
                      <label className="block text-sm font-medium text-gray-700 mb-2">选校偏好</label>
                      <label className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg hover:bg-purple-50 cursor-pointer bg-gray-50">
                        <input 
                          type="checkbox"
                          checked={profile.includeLiberalArts}
                          onChange={e => {
                            setProfile({...profile, includeLiberalArts: e.target.checked});
                          }}
                          className="w-4 h-4 text-purple-600"
                        />
                        <span className="text-sm">包含文理学院 (Liberal Arts College)</span>
                      </label>
                      <p className="text-xs text-gray-500 mt-1">默认不勾选，中国学生普遍更倾向于申请综合性大学</p>
                    </div>
                    <div className="col-span-3">
                      <label className="block text-sm font-medium text-gray-700 mb-2">科研/工作经历</label>
                      <textarea 
                        value={profile.activities}
                        onChange={e => setProfile({...profile, activities: e.target.value})}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                        placeholder="请描述您的科研项目、论文、实习、工作经历等"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm p-8">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Brain className="w-5 h-5 text-purple-600" />
                    女娲思维蒸馏选择
                  </h2>
                  <p className="text-sm text-gray-500 mb-4">选择顾问视角，生成个性化建议</p>
                  <div className="flex flex-wrap gap-3">
                    {experts.map(exp => (
                      <button
                        key={exp.id}
                        onClick={() => {
                          if (selectedExperts.includes(exp.id)) {
                            setSelectedExperts(selectedExperts.filter(e => e !== exp.id));
                          } else {
                            setSelectedExperts([...selectedExperts, exp.id]);
                          }
                        }}
                        className={'px-5 py-3 rounded-xl border-2 transition-all ' + (selectedExperts.includes(exp.id) ? 'border-purple-600 bg-purple-50 text-purple-700' : 'border-gray-200 text-gray-600 hover:border-gray-300')}
                      >
                        <span className="font-medium">{exp.name}</span>
                        <span className="text-xs ml-2 opacity-60">({exp.style})</span>
                      </button>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={generateReport}
                  disabled={isGenerating}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      女娲+达尔文+12维度协作生成中...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-5 h-5" />
                      继续下一页
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {/* ========== 多国申请策略 Tab ========== */}
        {activeTab === 'strategy' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg p-6 text-white">
              <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
                <Globe2 className="w-6 h-6" />
                多国申请策略
              </h2>
              <p className="text-blue-100">基于Agent测试验证的完整申请策略，覆盖5大申请目的地</p>
            </div>

            {/* 国家选择 */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-semibold mb-4">选择目标国家</h3>
              <div className="flex flex-wrap gap-3">
                {['美国', '加拿大', '英国', '香港', '新加坡'].map(c => (
                  <label key={c} className="flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-all">
                    <input 
                      type="checkbox"
                      checked={selectedTargetCountries.includes(c)}
                      onChange={e => {
                        if (e.target.checked) {
                          setSelectedTargetCountries([...selectedTargetCountries, c]);
                        } else {
                          setSelectedTargetCountries(selectedTargetCountries.filter(t => t !== c));
                        }
                      }}
                      className="w-5 h-5 text-blue-600 rounded"
                    />
                    <span className="font-medium">{countryStrategies.find(cs => cs.country === c)?.flag} {c}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 国家详情卡片 */}
            <div className="grid grid-cols-1 gap-6">
              {countryStrategies.filter(cs => selectedTargetCountries.includes(cs.country)).map(cs => (
                <div key={cs.country} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{cs.flag}</span>
                      <div>
                        <h3 className="text-xl font-bold">{cs.country}</h3>
                        <p className="text-gray-300 text-sm">申请系统: {cs.system}</p>
                      </div>
                      <div className="ml-auto text-right">
                        <p className="text-sm text-gray-300">主要截止</p>
                        <p className="font-semibold">{cs.deadline}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="mb-4">
                      <h4 className="font-semibold mb-3 text-gray-700">推荐学校</h4>
                      <div className="grid grid-cols-2 gap-3">
                        {cs.schools.map(school => (
                          <div key={school.name} className="border border-gray-100 rounded-xl p-4 hover:border-blue-200 transition-all">
                            <div className="flex justify-between items-start">
                              <div>
                                <span className="font-bold">{school.name}</span>
                                <span className="text-sm text-gray-500 ml-2">{school.major}</span>
                              </div>
                              <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">{school.deadline}</span>
                            </div>
                            <p className="text-sm text-gray-500 mt-2">{school.notes}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="mb-4">
                      <h4 className="font-semibold mb-3 text-gray-700">申请要求</h4>
                      <div className="flex flex-wrap gap-2">
                        {cs.requirements.map(req => (
                          <span key={req} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">{req}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3 text-gray-700">💡 申请Tips</h4>
                      <ul className="space-y-2">
                        {cs.tips.map((tip, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                            <ChevronRight className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 冲突处理预案 */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-orange-600">
                <AlertTriangle className="w-6 h-6" />
                ⚠️ Offer冲突处理预案
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {conflictScenarios.map((scenario, i) => (
                  <div key={i} className="border border-orange-100 bg-orange-50 rounded-xl p-5">
                    <h4 className="font-semibold text-orange-800 mb-3">{scenario.scenario}</h4>
                    <div className="space-y-2 mb-3">
                      {scenario.strategy.map((step, j) => (
                        <div key={j} className="flex items-start gap-3">
                          <span className="w-6 h-6 bg-orange-200 text-orange-700 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">{step.step}</span>
                          <span className="text-gray-700">{step.action}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-orange-600 italic">⚠️ {scenario.note}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========== 申请时间轴 Tab ========== */}
        {activeTab === 'timeline' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl shadow-lg p-6 text-white">
              <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
                <Calendar className="w-6 h-6" />
                申请时间轴
              </h2>
              <p className="text-green-100">智能规划申请节点，确保每个关键步骤按时完成</p>
            </div>

            {/* ED/EA策略选择 */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-semibold mb-4">申请轮次策略</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ED1 选择（绑定）</label>
                  <select 
                    value={edSchool}
                    onChange={e => setEdSchool(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  >
                    <option>CMU</option>
                    <option>Cornell</option>
                    <option>MIT</option>
                    <option>Stanford</option>
                    <option>宾大沃顿</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-2">⚠️ ED是绑定协议，录取必须入学</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">EA 选择（非绑定）</label>
                  <select 
                    value={eaSchool}
                    onChange={e => setEaSchool(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                  >
                    <option>密歇根</option>
                    <option>弗吉尼亚</option>
                    <option>MIT</option>
                    <option>佐治亚理工</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-2">EA不绑定，可同时持有其他offer</p>
                </div>
              </div>
            </div>

            {/* 时间轴 */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-semibold mb-6">申请进度检查点</h3>
              <div className="space-y-3">
                {checkpoints.map((cp, index) => (
                  <div 
                    key={cp.id}
                    className={'flex items-center gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer ' + (cp.completed ? 'border-green-200 bg-green-50' : cp.isUrgent ? 'border-orange-200 bg-orange-50 hover:border-orange-300' : 'border-gray-100 hover:border-gray-200')}
                    onClick={() => toggleCheckpoint(cp.id)}
                  >
                    <div className={'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ' + (cp.completed ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500')}>
                      {cp.completed ? <CheckCircle2 className="w-5 h-5" /> : <span className="text-sm font-bold">{index + 1}</span>}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="font-semibold">{cp.date}</span>
                        <span className={cp.completed ? 'text-green-600 line-through' : 'text-gray-900'}>{cp.title}</span>
                        {cp.isUrgent && !cp.completed && <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded-full">紧急</span>}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{cp.description}</p>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={cp.completed}
                      onChange={() => toggleCheckpoint(cp.id)}
                      className="w-5 h-5 text-green-600 rounded border-gray-300"
                    />
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">申请进度</span>
                  <span className="font-semibold text-green-600">{checkpoints.filter(cp => cp.completed).length}/{checkpoints.length} 完成</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all"
                    style={{ width: `${(checkpoints.filter(cp => cp.completed).length / checkpoints.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* 关键提醒 */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2 text-yellow-800">
                <AlertCircle className="w-5 h-5" />
                关键提醒
              </h3>
              <ul className="space-y-2 text-sm text-yellow-700">
                <li>• ED校建议在10月15日前完成主文书定稿</li>
                <li>• 推荐信至少提前2个月联系推荐人</li>
                <li>• SAT/ACT送分建议在提交前2周完成</li>
                <li>• 拿到offer后要在5月1日前答复学校（National Reply Date）</li>
              </ul>
            </div>
          </div>
        )}

        {/* ========== Offer决策 Tab ========== */}
        {activeTab === 'decision' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-lg p-6 text-white">
              <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
                <Scale className="w-6 h-6" />
                Offer决策矩阵
              </h2>
              <p className="text-purple-100">多维度量化分析，科学选择最终offer</p>
            </div>

            {/* 决策权重说明 */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-semibold mb-4">决策权重配置</h3>
              <div className="grid grid-cols-5 gap-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-2xl font-bold text-blue-600">30%</span>
                  </div>
                  <p className="text-sm font-medium">职业目标</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-2xl font-bold text-green-600">20%</span>
                  </div>
                  <p className="text-sm font-medium">地理位置</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-2xl font-bold text-yellow-600">20%</span>
                  </div>
                  <p className="text-sm font-medium">奖学金</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-2xl font-bold text-purple-600">15%</span>
                  </div>
                  <p className="text-sm font-medium">专业资源</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-2xl font-bold text-pink-600">15%</span>
                  </div>
                  <p className="text-sm font-medium">校友网络</p>
                </div>
              </div>
            </div>

            {/* 学校对比表 */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">学校对比</h3>
                <button 
                  onClick={calculateOfferScores}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all flex items-center gap-2"
                >
                  <Brain className="w-4 h-4" />
                  计算总分
                </button>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">学校</th>
                    <th className="text-center py-3 px-2 font-semibold text-gray-600">奖学金</th>
                    <th className="text-center py-3 px-2 font-semibold text-gray-600">职业目标</th>
                    <th className="text-center py-3 px-2 font-semibold text-gray-600">地理位置</th>
                    <th className="text-center py-3 px-2 font-semibold text-gray-600">专业资源</th>
                    <th className="text-center py-3 px-2 font-semibold text-gray-600">校友网络</th>
                    <th className="text-center py-3 px-2 font-semibold text-purple-600">总分</th>
                  </tr>
                </thead>
                <tbody>
                  {decisionOffers.map((offer, i) => (
                    <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4 font-semibold">{offer.school}</td>
                      <td className="py-4 px-2 text-center">
                        <input 
                          type="number"
                          value={offer.scholarship}
                          onChange={e => {
                            const newOffers = [...decisionOffers];
                            newOffers[i].scholarship = parseInt(e.target.value) || 0;
                            setDecisionOffers(newOffers);
                          }}
                          className="w-16 px-2 py-1 border border-gray-200 rounded text-center"
                        />
                      </td>
                      <td className="py-4 px-2 text-center">
                        <input 
                          type="number"
                          value={offer.careerScore}
                          onChange={e => {
                            const newOffers = [...decisionOffers];
                            newOffers[i].careerScore = parseInt(e.target.value) || 0;
                            setDecisionOffers(newOffers);
                          }}
                          className="w-16 px-2 py-1 border border-gray-200 rounded text-center"
                        />
                      </td>
                      <td className="py-4 px-2 text-center">
                        <input 
                          type="number"
                          value={offer.locationScore}
                          onChange={e => {
                            const newOffers = [...decisionOffers];
                            newOffers[i].locationScore = parseInt(e.target.value) || 0;
                            setDecisionOffers(newOffers);
                          }}
                          className="w-16 px-2 py-1 border border-gray-200 rounded text-center"
                        />
                      </td>
                      <td className="py-4 px-2 text-center">
                        <input 
                          type="number"
                          value={offer.programScore}
                          onChange={e => {
                            const newOffers = [...decisionOffers];
                            newOffers[i].programScore = parseInt(e.target.value) || 0;
                            setDecisionOffers(newOffers);
                          }}
                          className="w-16 px-2 py-1 border border-gray-200 rounded text-center"
                        />
                      </td>
                      <td className="py-4 px-2 text-center">
                        <input 
                          type="number"
                          value={offer.networkScore}
                          onChange={e => {
                            const newOffers = [...decisionOffers];
                            newOffers[i].networkScore = parseInt(e.target.value) || 0;
                            setDecisionOffers(newOffers);
                          }}
                          className="w-16 px-2 py-1 border border-gray-200 rounded text-center"
                        />
                      </td>
                      <td className="py-4 px-2 text-center">
                        <span className={'px-3 py-1 rounded-full font-bold ' + (offer.total > 80 ? 'bg-green-100 text-green-700' : offer.total > 60 ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700')}>
                          {offer.total}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 决策建议 */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-purple-600" />
                AI决策建议
              </h3>
              <div className="space-y-3">
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <p className="text-gray-700">
                    <span className="font-semibold text-purple-600">推荐策略：</span>
                    根据测试结果，留学选校Agent建议优先考虑<strong>职业目标</strong>（30%权重）。
                    若目标是投行/咨询→ 沃顿；若目标是科技创业→ 斯隆/哈斯。
                  </p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <p className="text-gray-700">
                    <span className="font-semibold text-orange-600">注意事项：</span>
                    ED是绑定协议，录取后必须入学。如有offer冲突，建议先接受ED，
                    同时与梦校沟通defer可能性。
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'finder' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">智能选校推荐</h2>
                <button
                  onClick={() => generateRecommendations(applicationType || 'grad')}
                  disabled={!applicationType}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Wand2 className="w-4 h-4" />
                  根据我的条件生成推荐
                </button>
              </div>
              
              {!applicationType && (
                <div className="text-center py-8 text-gray-500">
                  <GraduationCap className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>请先在「基本信息」中选择申请类型（本科/研究生）</p>
                </div>
              )}
              
              {applicationType && recommendedSchools.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Brain className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>点击上方按钮，根据您的条件生成个性化推荐</p>
                  <p className="text-sm mt-2">推荐基于《Admission Matters》录取方法论动态计算</p>
                </div>
              )}
              
              {recommendedSchools.length > 0 && (
                <>
                  {/* 统计信息 */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-red-50 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-red-600">
                        {recommendedSchools.filter(s => s.category === 'reach').length}
                      </div>
                      <div className="text-sm text-red-600">冲刺校</div>
                    </div>
                    <div className="bg-green-50 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {recommendedSchools.filter(s => s.category === 'match').length}
                      </div>
                      <div className="text-sm text-green-600">匹配校</div>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {recommendedSchools.filter(s => s.category === 'safety').length}
                      </div>
                      <div className="text-sm text-blue-600">保底校</div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {recommendedSchools.map((result) => (
                      <div key={result.school.name} className="border border-gray-100 rounded-xl p-5 hover:border-blue-200 hover:shadow-md transition-all bg-white">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-lg">{result.school.name}</h3>
                              <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">USNEWS #{result.school.usNewsRank}</span>
                            </div>
                            <p className="text-sm text-gray-500">{result.school.program}</p>
                          </div>
                          <div className="text-right">
                            <span className={'px-3 py-1 rounded-full text-xs font-medium ' + (result.category === 'reach' ? 'bg-red-100 text-red-600' : result.category === 'match' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600')}>
                              {result.category === 'reach' ? '冲刺' : result.category === 'match' ? '匹配' : '保底'}
                            </span>
                            <div className="text-lg font-bold text-blue-600 mt-1">{result.admissionProbability}%</div>
                          </div>
                        </div>
                        
                        {/* 分数分解 */}
                        <div className="mb-3 text-xs text-gray-500">
                          综合分数: {result.score} | 学术: {result.breakdown.academic} | 考试: {result.breakdown.testScore} | 活动: {result.breakdown.activities}
                        </div>
                        
                        <div className="grid grid-cols-5 gap-3">
                          <div className="bg-gray-50 rounded-lg p-3">
                            <span className="text-xs text-gray-500 block">学费/年</span>
                            <span className="font-semibold">{result.school.tuition}</span>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-3">
                            <span className="text-xs text-gray-500 block">录取率</span>
                            <span className="font-semibold">{result.school.admissionRate}</span>
                          </div>
                          <div className="bg-green-50 rounded-lg p-3">
                            <span className="text-xs text-gray-500 block">就业率</span>
                            <span className="font-semibold text-green-600">{result.school.employmentRate}</span>
                          </div>
                          <div className="bg-blue-50 rounded-lg p-3">
                            <span className="text-xs text-gray-500 block">起薪</span>
                            <span className="font-semibold text-blue-600">{result.school.salary}</span>
                          </div>
                          <div className="bg-purple-50 rounded-lg p-3">
                            <span className="text-xs text-gray-500 block">OPT</span>
                            <span className="font-semibold text-purple-600">{result.school.optMonths}月</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
              
              {applicationType && (
                <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                  <h4 className="font-medium text-sm mb-2">💡 基于《Admission Matters》的选校策略</h4>
                  <div className="text-xs text-gray-600 space-y-1">
                    {applicationType === 'undergrad' ? (
                      <>
                        <p>• 学术记录(GPA+课程难度)权重: <b>35%</b></p>
                        <p>• SAT/ACT权重: <b>25%</b></p>
                        <p>• 课程难度(AP/IB)权重: <b>15%</b></p>
                        <p>• 课外活动权重: <b>15%</b></p>
                        <p>• 推荐信权重: <b>10%</b></p>
                        <p className="mt-2">• Common App建议: 冲刺3-5所 + 匹配8-10所 + 保底3-5所 (上限20所)</p>
                      </>
                    ) : (
                      <>
                        <p>• 本科GPA权重: <b>30%</b></p>
                        <p>• 科研经历权重: <b>25%</b></p>
                        <p>• TOEFL权重: <b>15%</b></p>
                        <p>• GRE权重: <b>15%</b></p>
                        <p>• 推荐信权重: <b>10%</b></p>
                        <p>• 文书权重: <b>5%</b></p>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'dimensions' && (
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              选校12维度（可多选）
            </h2>
            <div className="grid grid-cols-3 gap-4">
              {dimensions.map(dim => (
                <button
                  key={dim.id}
                  onClick={() => {
                    if (selectedDimensions.includes(dim.id)) {
                      setSelectedDimensions(selectedDimensions.filter(d => d !== dim.id));
                    } else {
                      setSelectedDimensions([...selectedDimensions, dim.id]);
                    }
                  }}
                  className={'p-4 rounded-xl border-2 text-left transition-all ' + (selectedDimensions.includes(dim.id) ? 'border-blue-600 bg-blue-50' : 'border-gray-100 hover:border-gray-200')}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <dim.icon className={'w-5 h-5 ' + (selectedDimensions.includes(dim.id) ? 'text-blue-600' : 'text-gray-400')} />
                    <span className={'font-medium ' + (selectedDimensions.includes(dim.id) ? 'text-blue-700' : 'text-gray-600')}>{dim.name}</span>
                  </div>
                  <p className="text-xs text-gray-500">{dim.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'cost' && (
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <h2 className="text-xl font-semibold mb-6">费用计算器</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">选择学校</label>
                  <select className="w-full px-4 py-3 border border-gray-200 rounded-xl">
                    {schools.map(s => <option key={s.name}>{s.name} - {s.program}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">学制</label>
                  <select className="w-full px-4 py-3 border border-gray-200 rounded-xl">
                    <option>2年制硕士</option>
                    <option>1年制硕士</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg p-8 text-white">
              <h2 className="text-xl font-semibold mb-6">费用估算结果</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-white/20">
                  <span className="text-white/80">学费（2年）</span>
                  <span className="font-semibold">$76,000</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-white/20">
                  <span className="text-white/80">生活费（2年）</span>
                  <span className="font-semibold">$28,000</span>
                </div>
                <div className="flex justify-between items-center py-4 bg-white/10 rounded-xl px-4 mt-4">
                  <span className="text-lg font-medium">总计</span>
                  <span className="text-2xl font-bold">$110,000</span>
                </div>
                <div className="text-center text-white/60 text-sm mt-4">
                  约 77万人民币
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'doc' && (
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <h2 className="text-xl font-semibold mb-6">材料清单生成器</h2>
            <div className="grid grid-cols-2 gap-6">
              {[
                { category: '学术材料', color: 'blue', items: ['成绩单（密封件）', '在读证明', '毕业证书/学位证', 'GPA说明信'] },
                { category: '标化成绩', color: 'purple', items: ['TOEFL成绩单', 'SAT/ACT成绩单', 'AP成绩单', 'GRE/GMAT（如需）'] },
                { category: '文书材料', color: 'green', items: ['Personal Statement', '推荐信 x 3封', '简历 CV', '补充文书'] },
                { category: '身份材料', color: 'orange', items: ['护照扫描件', '照片（电子版）', '资金证明', '签证材料'] },
              ].map(section => (
                <div key={section.category} className="border border-gray-100 rounded-xl p-5">
                  <h3 className={'font-semibold mb-4 text-' + section.color + '-600'}>{section.category}</h3>
                  <div className="space-y-3">
                    {section.items.map(item => (
                      <label key={item} className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-all">
                        <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                        <span className="text-sm">{item}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'writing' && (
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <h2 className="text-xl font-semibold mb-6">文书助手</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">文书类型</label>
                  <select className="w-full px-4 py-3 border border-gray-200 rounded-xl">
                    <option>Personal Statement</option>
                    <option>Statement of Purpose</option>
                    <option>补充文书</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">输入您的背景</label>
                  <textarea 
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                    placeholder="请描述您的学术背景、实习经历、项目经验..."
                  />
                </div>
                <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-medium hover:from-purple-700 hover:to-pink-700 transition-all flex items-center justify-center gap-2">
                  <Wand2 className="w-4 h-4" />
                  生成文书思路
                </button>
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-sm p-8">
              <h2 className="text-xl font-semibold mb-6">女娲思维建议</h2>
              <div className="space-y-4">
                {[
                  { num: 1, title: '开头要直接', desc: '避免套话，用具体事例切入' },
                  { num: 2, title: '量化成果', desc: '每个论点用具体数字支撑' },
                  { num: 3, title: '呼应目标', desc: '说明项目如何帮助实现职业规划' },
                  { num: 4, title: '真实可信', desc: '用具体例子支撑论点' },
                  { num: 5, title: '避免模板', desc: '展示独特的个人视角' },
                ].map(item => (
                  <div key={item.num} className="flex items-start gap-4 bg-white rounded-xl p-4 shadow-sm">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-purple-600 font-bold text-sm">{item.num}</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{item.title}</h4>
                      <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'report' && (
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <h2 className="text-xl font-semibold mb-6">选校报告（12维度版）</h2>
            {report ? (
              <div className="bg-gray-50 rounded-xl p-6">
                <pre className="whitespace-pre-wrap text-sm font-mono leading-relaxed">{report}</pre>
              </div>
            ) : (
              <div className="text-center py-16 text-gray-400">
                <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>请先填写学生信息并生成报告</p>
                <button 
                  onClick={() => setActiveTab('profile')}
                  className="mt-4 text-blue-600 hover:underline font-medium"
                >
                  去填写
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* 历史记录弹窗 */}
      {showHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold">学生信息历史记录</h2>
              <button
                onClick={() => setShowHistory(false)}
                className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {submissions.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>暂无历史记录</p>
                  <p className="text-sm mt-2">填写学生信息后会在这里显示</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {submissions.map(sub => (
                    <div key={sub.id} className="border rounded-xl p-4 hover:shadow-md transition-all">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${sub.type === 'undergrad' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                            {sub.type === 'undergrad' ? '🎓 本科申请' : '🎓 研究生申请'}
                          </span>
                          <span className="text-gray-500 text-sm">{sub.date}</span>
                        </div>
                        <button
                          onClick={() => {
                            if (confirm('确定要删除这条记录吗？')) {
                              const updated = submissions.filter(s => s.id !== sub.id);
                              setSubmissions(updated);
                              localStorage.setItem('studentSubmissions', JSON.stringify(updated));
                            }
                          }}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          删除
                        </button>
                      </div>
                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div><span className="text-gray-500">姓名：</span><span className="font-medium">{sub.data.name || '-'}</span></div>
                        <div><span className="text-gray-500">学校：</span><span className="font-medium">{sub.data.school || '-'}</span></div>
                        <div><span className="text-gray-500">专业：</span><span className="font-medium">{sub.data.major || '-'}</span></div>
                        <div><span className="text-gray-500">GPA：</span><span className="font-medium">{sub.data.gpa || '-'}</span></div>
                        <div><span className="text-gray-500">SAT：</span><span className="font-medium">{sub.data.sat || '-'}</span></div>
                        <div><span className="text-gray-500">TOEFL：</span><span className="font-medium">{sub.data.toefl || '-'}</span></div>
                        <div><span className="text-gray-500">预算：</span><span className="font-medium">{sub.data.budget || '-'}</span></div>
                        <div><span className="text-gray-500">国家：</span><span className="font-medium">{sub.data.targetCountries?.join(', ') || '-'}</span></div>
                      </div>
                      {sub.data.activities && (
                        <div className="mt-3 text-sm">
                          <span className="text-gray-500">活动：</span>
                          <span className="text-gray-700">{sub.data.activities.slice(0, 100)}{sub.data.activities.length > 100 ? '...' : ''}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
