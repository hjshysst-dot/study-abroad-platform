import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3001;
const DATA_DIR = join(__dirname, 'data');

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Serve static files from client dist
app.use(express.static(join(__dirname, '../client/dist')));

// ============================================
// 研究生项目数据库（从JSON文件加载）
// ============================================
let GRAD_PROGRAMS_DB = [];
try {
  const gradData = JSON.parse(fs.readFileSync(join(DATA_DIR, 'grad-programs.json'), 'utf-8'));
  GRAD_PROGRAMS_DB = gradData.programs;
  console.log(`📚 研究生项目数据库加载: ${GRAD_PROGRAMS_DB.length} 个项目`);
} catch (err) {
  console.warn('⚠️ 研究生项目数据库加载失败:', err.message);
}

// ============================================
// 美国大学数据库（含真实录取率/学费/排名）
// 数据来源：USNEWS 2024 + 官网数据
// ============================================
const US_UNIVERSITIES_DB = [
  // ==================== 常青藤 + 顶尖私立 ====================
  { name: "Harvard University", shortName: "Harvard", type: "私立", rank: 3, admissionRate: 3.4, tuition: 54720, location: "Cambridge, MA", major: "综合", description: "全美最顶尖学府，历史悠久" },
  { name: "Yale University", shortName: "Yale", type: "私立", rank: 5, admissionRate: 4.4, tuition: 57254, location: "New Haven, CT", major: "综合", description: "法学、人文社科顶尖" },
  { name: "Princeton University", shortName: "Princeton", type: "私立", rank: 1, admissionRate: 4.4, tuition: 54894, location: "Princeton, NJ", major: "综合", description: "本科教育全美第一" },
  { name: "Columbia University", shortName: "Columbia", type: "私立", rank: 7, admissionRate: 4.1, tuition: 61410, location: "New York, NY", major: "综合", description: "地理位置优越，曼哈顿核心" },
  { name: "University of Pennsylvania", shortName: "UPenn", type: "私立", rank: 6, admissionRate: 5.8, tuition: 58750, location: "Philadelphia, PA", major: "综合", description: "沃顿商学院闻名" },
  { name: "Brown University", shortName: "Brown", type: "私立", rank: 9, admissionRate: 5.1, tuition: 58312, location: "Providence, RI", major: "综合", description: "开放课程体系" },
  { name: "Dartmouth College", shortName: "Dartmouth", type: "私立", rank: 12, admissionRate: 6.2, tuition: 59592, location: "Hanover, NH", major: "综合", description: "小班精英教育" },
  { name: "Cornell University", shortName: "Cornell", type: "私立", rank: 12, admissionRate: 7.9, tuition: 59790, location: "Ithaca, NY", major: "综合", description: "工程、Hotel管理顶尖" },
  
  // ==================== MIT + Stanford ====================
  { name: "Massachusetts Institute of Technology", shortName: "MIT", type: "私立", rank: 2, admissionRate: 3.9, tuition: 55718, location: "Cambridge, MA", major: "工程", description: "工程和科学全球第一" },
  { name: "Stanford University", shortName: "Stanford", type: "私立", rank: 3, admissionRate: 4.0, tuition: 57473, location: "Stanford, CA", major: "综合", description: "硅谷创业圣地" },
  
  // ==================== 其他顶尖私立 ====================
  { name: "University of Chicago", shortName: "UChicago", type: "私立", rank: 12, admissionRate: 5.9, tuition: 62478, location: "Chicago, IL", major: "综合", description: "经济学、社会学顶尖" },
  { name: "California Institute of Technology", shortName: "Caltech", type: "私立", rank: 7, admissionRate: 2.7, tuition: 60152, location: "Pasadena, CA", major: "科学", description: "理工科全球顶尖" },
  { name: "Northwestern University", shortName: "Northwestern", type: "私立", rank: 9, admissionRate: 7.2, tuition: 60768, location: "Evanston, IL", major: "综合", description: "新闻传播、商学院顶尖" },
  { name: "Duke University", shortName: "Duke", type: "私立", rank: 7, admissionRate: 5.1, tuition: 63763, location: "Durham, NC", major: "综合", description: "医学、商学院顶尖" },
  { name: "Johns Hopkins University", shortName: "JHU", type: "私立", rank: 9, admissionRate: 6.5, tuition: 60420, location: "Baltimore, MD", major: "综合", description: "医学、公共健康全球第一" },
  { name: "Rice University", shortName: "Rice", type: "私立", rank: 17, admissionRate: 8.7, tuition: 56528, location: "Houston, TX", major: "综合", description: "工程、建筑学顶尖" },
  { name: "Vanderbilt University", shortName: "Vanderbilt", type: "私立", rank: 18, admissionRate: 5.6, tuition: 59468, location: "Nashville, TN", major: "综合", description: "教育学、医学顶尖" },
  { name: "University of Notre Dame", shortName: "Notre Dame", type: "私立", rank: 20, admissionRate: 12.9, tuition: 60455, location: "Notre Dame, IN", major: "综合", description: "商学院、法学顶尖" },
  { name: "Emory University", shortName: "Emory", type: "私立", rank: 24, admissionRate: 11.5, tuition: 57720, location: "Atlanta, GA", major: "综合", description: "医学、预科顶尖" },
  { name: "Washington University in St. Louis", shortName: "WashU", type: "私立", rank: 24, admissionRate: 11.3, tuition: 59970, location: "St. Louis, MO", major: "综合", description: "医学、商学院顶尖" },
  
  // ==================== 顶尖公立 ====================
  { name: "University of California, Berkeley", shortName: "UC Berkeley", type: "公立", rank: 15, admissionRate: 11.6, tuition: 44580, location: "Berkeley, CA", major: "综合", description: "CS、工程、自然科学顶尖" },
  { name: "University of California, Los Angeles", shortName: "UCLA", type: "公立", rank: 15, admissionRate: 8.8, tuition: 44390, location: "Los Angeles, CA", major: "综合", description: "综合实力强" },
  { name: "University of California, San Diego", shortName: "UCSD", type: "公立", rank: 21, admissionRate: 24.3, tuition: 44390, location: "La Jolla, CA", major: "综合", description: "工程、生物、CS顶尖" },
  { name: "University of California, Davis", shortName: "UC Davis", type: "公立", rank: 28, admissionRate: 37.5, tuition: 44390, location: "Davis, CA", major: "综合", description: "农业、环境科学顶尖" },
  { name: "University of California, Irvine", shortName: "UCI", type: "公立", rank: 33, admissionRate: 26.1, tuition: 44390, location: "Irvine, CA", major: "综合", description: "CS、信息科学顶尖" },
  { name: "University of California, Santa Barbara", shortName: "UCSB", type: "公立", rank: 35, admissionRate: 26.1, tuition: 44390, location: "Santa Barbara, CA", major: "综合", description: "工程、物理顶尖" },
  { name: "University of Michigan", shortName: "UMich", type: "公立", rank: 21, admissionRate: 18.0, tuition: 57986, location: "Ann Arbor, MI", major: "综合", description: "工程、商学院顶尖" },
  { name: "University of Virginia", shortName: "UVA", type: "公立", rank: 24, admissionRate: 18.7, tuition: 56950, location: "Charlottesville, VA", major: "综合", description: "商学、法学顶尖" },
  { name: "University of North Carolina at Chapel Hill", shortName: "UNC Chapel Hill", type: "公立", rank: 22, admissionRate: 17.6, tuition: 39089, location: "Chapel Hill, NC", major: "综合", description: "医学、药学顶尖" },
  { name: "Georgia Institute of Technology", shortName: "Georgia Tech", type: "公立", rank: 33, admissionRate: 16.0, tuition: 40862, location: "Atlanta, GA", major: "工程", description: "工程、CS全美前五" },
  { name: "University of Texas at Austin", shortName: "UT Austin", type: "公立", rank: 38, admissionRate: 31.0, tuition: 41898, location: "Austin, TX", major: "综合", description: "CS、商学院顶尖" },
  { name: "University of Wisconsin-Madison", shortName: "UW Madison", type: "公立", rank: 35, admissionRate: 49.0, tuition: 41164, location: "Madison, WI", major: "综合", description: "CS、工程、自然科学顶尖" },
  { name: "University of Illinois Urbana-Champaign", shortName: "UIUC", type: "公立", rank: 35, admissionRate: 45.0, tuition: 44184, location: "Champaign, IL", major: "工程", description: "CS、工程全美前五" },
  { name: "University of Florida", shortName: "UF", type: "公立", rank: 28, admissionRate: 30.0, tuition: 29630, location: "Gainesville, FL", major: "综合", description: "医学、商学院不错" },
  { name: "University of Colorado Boulder", shortName: "CU Boulder", type: "公立", rank: 105, admissionRate: 80.0, tuition: 40686, location: "Boulder, CO", major: "综合", description: "物理、大气科学顶尖" },
  { name: "Penn State University", shortName: "Penn State", type: "公立", rank: 60, admissionRate: 54.0, tuition: 37854, location: "University Park, PA", major: "综合", description: "工程、商学院不错" },
  
  // ==================== 计算机强校 ====================
  { name: "Carnegie Mellon University", shortName: "CMU", type: "私立", rank: 22, admissionRate: 11.0, tuition: 62458, location: "Pittsburgh, PA", major: "CS", description: "CS全球第一，戏剧顶尖" },
  { name: "University of Washington", shortName: "UW", type: "公立", rank: 40, admissionRate: 48.0, tuition: 41478, location: "Seattle, WA", major: "CS", description: "CS、医学顶尖" },
  { name: "Arizona State University", shortName: "ASU", type: "公立", rank: 105, admissionRate: 88.0, tuition: 31450, location: "Tempe, AZ", major: "综合", description: "CS性价比高" },
  { name: "Rochester Institute of Technology", shortName: "RIT", type: "私立", rank: 98, admissionRate: 57.0, tuition: 56860, location: "Rochester, NY", major: "CS", description: "计算机、工程强" },
  { name: "University of Texas at Dallas", shortName: "UT Dallas", type: "公立", rank: 115, admissionRate: 85.0, tuition: 43298, location: "Richardson, TX", major: "CS", description: "CS性价比高" },
  
  // ==================== 区域强校 ====================
  { name: "Boston University", shortName: "BU", type: "私立", rank: 43, admissionRate: 14.4, tuition: 62540, location: "Boston, MA", major: "综合", description: "传媒、医学不错" },
  { name: "Boston College", shortName: "BC", type: "私立", rank: 39, admissionRate: 16.7, tuition: 65116, location: "Chestnut Hill, MA", major: "综合", description: "商学、经济学顶尖" },
  { name: "Northeastern University", shortName: "Northeastern", type: "私立", rank: 44, admissionRate: 5.5, tuition: 61465, location: "Boston, MA", major: "综合", description: "CS、工程不错" },
  { name: "Tulane University", shortName: "Tulane", type: "私立", rank: 73, admissionRate: 10.6, tuition: 66870, location: "New Orleans, LA", major: "综合", description: "商学、公共健康不错" },
  { name: "Wake Forest University", shortName: "Wake Forest", type: "私立", rank: 47, admissionRate: 11.4, tuition: 62680, location: "Winston-Salem, NC", major: "综合", description: "医学、商学院顶尖" },
  { name: "Case Western Reserve University", shortName: "Case Western", type: "私立", rank: 53, admissionRate: 30.0, tuition: 54880, location: "Cleveland, OH", major: "综合", description: "医学、工程不错" },
  { name: "George Washington University", shortName: "GWU", type: "私立", rank: 62, admissionRate: 43.0, tuition: 61030, location: "Washington, DC", major: "综合", description: "政治、国际关系顶尖" },
  { name: "American University", shortName: "AU", type: "私立", rank: 105, admissionRate: 55.0, tuition: 54596, location: "Washington, DC", major: "综合", description: "国际关系、政治不错" },
  { name: "Howard University", shortName: "Howard", type: "私立", rank: 89, admissionRate: 36.0, tuition: 31580, location: "Washington, DC", major: "综合", description: "历史、黑人大学" },
  
  // ==================== 商科强校 ====================
  { name: "University of Pennsylvania - Wharton", shortName: "Wharton", type: "私立", rank: 1, admissionRate: 5.8, tuition: 58750, location: "Philadelphia, PA", major: "商科", description: "商学院全球第一" },
  { name: "Northwestern University - Kellogg", shortName: "Kellogg", type: "私立", rank: 3, admissionRate: 7.2, tuition: 60768, location: "Evanston, IL", major: "商科", description: "市场营销、管理学顶尖" },
  { name: "NYU - Stern", shortName: "Stern", type: "私立", rank: 30, admissionRate: 8.0, tuition: 60126, location: "New York, NY", major: "商科", description: "金融、会计顶尖" },
  { name: "UC Berkeley - Haas", shortName: "Haas", type: "公立", rank: 2, admissionRate: 11.6, tuition: 44580, location: "Berkeley, CA", major: "商科", description: "创业学、Finance顶尖" },
  { name: "University of Michigan - Ross", shortName: "Ross", type: "公立", rank: 10, admissionRate: 18.0, tuition: 57986, location: "Ann Arbor, MI", major: "商科", description: "供应链、市场营销顶尖" },
  { name: "Duke University - Fuqua", shortName: "Fuqua", type: "私立", rank: 11, admissionRate: 5.1, tuition: 63763, location: "Durham, NC", major: "商科", description: "综合管理学顶尖" },
  { name: "Dartmouth College - Tuck", shortName: "Tuck", type: "私立", rank: 11, admissionRate: 6.2, tuition: 59592, location: "Hanover, NH", major: "商科", description: "小型精英MBA" },
  { name: "Yale School of Management", shortName: "Yale SOM", type: "私立", rank: 9, admissionRate: 4.4, tuition: 57254, location: "New Haven, CT", major: "商科", description: "资产管理、私募股权强" },
  
  // ==================== 文理学院 Top 30 ====================
  { name: "Williams College", shortName: "Williams", type: "文理学院", rank: 1, admissionRate: 8.1, tuition: 64230, location: "Williamstown, MA", major: "文理", description: "全美最佳文理学院" },
  { name: "Amherst College", shortName: "Amherst", type: "文理学院", rank: 2, admissionRate: 7.0, tuition: 64400, location: "Amherst, MA", major: "文理", description: "人文社科顶尖" },
  { name: "Swarthmore College", shortName: "Swarthmore", type: "文理学院", rank: 4, admissionRate: 7.0, tuition: 62104, location: "Swarthmore, PA", major: "文理", description: "工程、人文社科强" },
  { name: "Pomona College", shortName: "Pomona", type: "文理学院", rank: 4, admissionRate: 9.1, tuition: 62422, location: "Claremont, CA", major: "文理", description: "综合文理学院" },
  { name: "Claremont McKenna College", shortName: "CMC", type: "文理学院", rank: 6, admissionRate: 10.3, tuition: 63150, location: "Claremont, CA", major: "文理", description: "政治、经济学强" },
  { name: "Harvey Mudd College", shortName: "Harvey Mudd", type: "文理学院", rank: 8, admissionRate: 12.0, tuition: 63996, location: "Claremont, CA", major: "理工", description: "工程、科学顶尖" },
  { name: "Middlebury College", shortName: "Middlebury", type: "文理学院", rank: 9, admissionRate: 13.0, tuition: 62680, location: "Middlebury, VT", major: "文理", description: "语言、国际研究强" },
  { name: "Bowdoin College", shortName: "Bowdoin", type: "文理学院", rank: 9, admissionRate: 9.0, tuition: 63682, location: "Brunswick, ME", major: "文理", description: "人文社科强" },
  { name: "Wesleyan University", shortName: "Wesleyan", type: "文理学院", rank: 12, admissionRate: 19.0, tuition: 65638, location: "Middletown, CT", major: "文理", description: "电影、音乐、人文强" },
  { name: "Hamilton College", shortName: "Hamilton", type: "文理学院", rank: 14, admissionRate: 12.0, tuition: 63480, location: "Clinton, NY", major: "文理", description: "开放课程、无专业限制" },
  { name: "Colby College", shortName: "Colby", type: "文理学院", rank: 14, admissionRate: 8.0, tuition: 65470, location: "Waterville, ME", major: "文理", description: "环境科学、政治强" },
  { name: "Bryn Mawr College", shortName: "Bryn Mawr", type: "文理学院", rank: 30, admissionRate: 31.0, tuition: 60600, location: "Bryn Mawr, PA", major: "文理", description: "女性教育、人文社科强" },
  { name: "Vassar College", shortName: "Vassar", type: "文理学院", rank: 13, admissionRate: 20.0, tuition: 64780, location: "Poughkeepsie, NY", major: "文理", description: "人文、艺术强" },
  { name: "Washington and Lee University", shortName: "W&L", type: "文理学院", rank: 15, admissionRate: 17.0, tuition: 65540, location: "Lexington, VA", major: "商科", description: "商学、法学顶尖" },
  { name: "Carleton College", shortName: "Carleton", type: "文理学院", rank: 9, admissionRate: 11.0, tuition: 64235, location: "Northfield, MN", major: "文理", description: "理科、人文强" },
  { name: "Davidson College", shortName: "Davidson", type: "文理学院", rank: 17, admissionRate: 17.0, tuition: 60187, location: "Davidson, NC", major: "文理", description: "经济学、政治强" },
  { name: "Barnard College", shortName: "Barnard", type: "文理学院", rank: 18, admissionRate: 9.0, tuition: 64336, location: "New York, NY", major: "文理", description: "女性教育、藤校资源" },
  { name: "Smith College", shortName: "Smith", type: "文理学院", rank: 18, admissionRate: 28.0, tuition: 64780, location: "Northampton, MA", major: "文理", description: "女性教育、艺术强" },
  { name: "Wellesley College", shortName: "Wellesley", type: "文理学院", rank: 5, admissionRate: 15.0, tuition: 64780, location: "Wellesley, MA", major: "文理", description: "女性教育、理科强" },
  { name: "Grinnell College", shortName: "Grinnell", type: "文理学院", rank: 11, admissionRate: 11.0, tuition: 62484, location: "Grinnell, IA", major: "文理", description: "理科、人文强" },
  { name: "Haverford College", shortName: "Haverford", type: "文理学院", rank: 18, admissionRate: 14.0, tuition: 65710, location: "Haverford, PA", major: "文理", description: "荣誉学院、文理强" },
  { name: "Colorado College", shortName: "Colorado College", type: "文理学院", rank: 25, admissionRate: 16.0, tuition: 63140, location: "Colorado Springs, CO", major: "文理", description: "户外教育、环境科学强" },
  { name: "Macalester College", shortName: "Macalester", type: "文理学院", rank: 25, admissionRate: 13.0, tuition: 63222, location: "St. Paul, MN", major: "文理", description: "政治、国际研究强" },
  { name: "Oberlin College", shortName: "Oberlin", type: "文理学院", rank: 30, admissionRate: 36.0, tuition: 64476, location: "Oberlin, OH", major: "文理", description: "音乐、艺术强" },
  { name: "Bates College", shortName: "Bates", type: "文理学院", rank: 25, admissionRate: 12.0, tuition: 64880, location: "Lewiston, ME", major: "文理", description: "政治、科学强" },
  { name: "Kenyon College", shortName: "Kenyon", type: "文理学院", rank: 30, admissionRate: 32.0, tuition: 66630, location: "Gambier, OH", major: "文理", description: "写作、文学强" },
  { name: "Scripps College", shortName: "Scripps", type: "文理学院", rank: 30, promotionRate: 30.0, tuition: 63320, location: "Claremont, CA", major: "文理", description: "女性教育、艺术强" },
  { name: "Pitzer College", shortName: "Pitzer", type: "文理学院", rank: 35, admissionRate: 33.0, tuition: 62990, location: "Claremont, CA", major: "文理", description: "环境研究、社会学强" },
  { name: "Connecticut College", shortName: "Conn College", type: "文理学院", rank: 50, admissionRate: 45.0, tuition: 62730, location: "New London, CT", major: "文理", description: "人文、艺术强" },
  { name: "Denison University", shortName: "Denison", type: "文理学院", rank: 51, admissionRate: 22.0, tuition: 64860, location: "Granville, OH", major: "文理", description: "理科、商科强" },
  { name: "Lafayette College", shortName: "Lafayette", type: "文理学院", rank: 40, admissionRate: 10.0, tuition: 64478, location: "Easton, PA", major: "文理", description: "工程、文理强" },
  { name: "Union College", shortName: "Union", type: "文理学院", rank: 45, admissionRate: 12.0, tuition: 64334, location: "Schenectady, NY", major: "文理", description: "工程、文理强" },
  { name: "Dickinson College", shortName: "Dickinson", type: "文理学院", rank: 55, admissionRate: 42.0, tuition: 62190, location: "Carlisle, PA", major: "文理", description: "国际关系、环境科学强" },
  { name: "Furman University", shortName: "Furman", type: "文理学院", rank: 47, admissionRate: 24.0, tuition: 63060, location: "Greenville, SC", major: "文理", description: "文科、商科强" },
  { name: "Rhodes College", shortName: "Rhodes", type: "文理学院", rank: 46, admissionRate: 33.0, tuition: 51310, location: "Memphis, TN", major: "文理", description: "人文、理科强" },
  { name: "Sewanee - University of the South", shortName: "Sewanee", type: "文理学院", rank: 50, admissionRate: 38.0, tuition: 55210, location: "Sewanee, TN", major: "文理", description: "神学、文理强" },
  { name: "St. Lawrence University", shortName: "St. Lawrence", type: "文理学院", rank: 56, admissionRate: 47.0, tuition: 63790, location: "Canton, NY", major: "文理", description: "户外教育、文理强" },
  { name: "Worcester Polytechnic Institute", shortName: "WPI", type: "文理学院", rank: 67, admissionRate: 47.0, tuition: 58838, location: "Worcester, MA", major: "理工", description: "工程、CS强" },
  { name: "Bucknell University", shortName: "Bucknell", type: "文理学院", rank: 30, admissionRate: 11.0, tuition: 65864, location: "Lewisburg, PA", major: "文理", description: "工程、文理强" },
  { name: "University of Richmond", shortName: "Richmond", type: "文理学院", rank: 22, admissionRate: 31.0, tuition: 60420, location: "Richmond, VA", major: "文理", description: "商学、文理强" },
  { name: "Occidental College", shortName: "Occidental", type: "文理学院", rank: 55, admissionRate: 38.0, tuition: 63840, location: "Los Angeles, CA", major: "文理", description: "人文、社会科学强" },
  
  // ==================== 保底校 ====================
  { name: "Ohio State University", shortName: "OSU", type: "公立", rank: 43, admissionRate: 57.0, tuition: 35446, location: "Columbus, OH", major: "综合", description: "大型公立校" },
  { name: "University of Minnesota, Twin Cities", shortName: "UMN", type: "公立", rank: 53, admissionRate: 70.0, tuition: 40520, location: "Minneapolis, MN", major: "综合", description: "CS、工程强" },
  { name: "Purdue University", shortName: "Purdue", type: "公立", rank: 43, admissionRate: 67.0, tuition: 31884, location: "West Lafayette, IN", major: "工程", description: "工程、航空强" },
  { name: "Indiana University Bloomington", shortName: "IU", type: "公立", rank: 73, admissionRate: 82.0, tuition: 39612, location: "Bloomington, IN", major: "综合", description: "商学、音乐强" },
  { name: "Rutgers University", shortName: "Rutgers", type: "公立", rank: 124, admissionRate: 72.0, tuition: 36540, location: "New Brunswick, NJ", major: "综合", description: "商学、CS强" },
  { name: "University of Arizona", shortName: "Arizona", type: "公立", rank: 124, admissionRate: 87.0, tuition: 38728, location: "Tucson, AZ", major: "综合", description: "光学、天文强" },
  { name: "University of Utah", shortName: "Utah", type: "公立", rank: 115, admissionRate: 89.0, tuition: 32328, location: "Salt Lake City, UT", major: "综合", description: "CS、医预科强" },
  { name: "Illinois Institute of Technology", shortName: "IIT", type: "私立", rank: 97, admissionRate: 50.0, tuition: 48137, location: "Chicago, IL", major: "工程", description: "工程、CS性价比高" },

  // ==================== 美国大学补充（USNews前100）====================
  { name: "University of California, Santa Cruz", shortName: "UCSC", type: "公立", rank: 82, admissionRate: 58.9, tuition: 44390, location: "Santa Cruz, CA", major: "综合", description: "CS、音乐强" },
  { name: "University of California, Riverside", shortName: "UCR", type: "公立", rank: 76, admissionRate: 63.0, tuition: 44390, location: "Riverside, CA", major: "综合", description: "商学、工程不错" },
  { name: "University of California, Merced", shortName: "UC Merced", type: "公立", rank: 97, admissionRate: 86.0, tuition: 44390, location: "Merced, CA", major: "综合", description: "新建校、CS性价比高" },
  { name: "Florida State University", shortName: "FSU", type: "公立", rank: 53, admissionRate: 60.0, tuition: 21670, location: "Tallahassee, FL", major: "综合", description: "商学、法学强" },
  { name: "University of Maryland, College Park", shortName: "UMD", type: "公立", rank: 46, admissionRate: 45.0, tuition: 41108, location: "College Park, MD", major: "综合", description: "CS、工程、商学强" },
  { name: "University of Pittsburgh", shortName: "Pitt", type: "公立", rank: 67, admissionRate: 54.0, tuition: 42560, location: "Pittsburgh, PA", major: "综合", description: "医学、哲学强" },
  { name: "University of Connecticut", shortName: "UConn", type: "公立", rank: 67, admissionRate: 55.0, tuition: 43754, location: "Storrs, CT", major: "综合", description: "工程、商学强" },
  { name: "University of Georgia", shortName: "UGA", type: "公立", rank: 47, admissionRate: 48.0, tuition: 31724, location: "Athens, GA", major: "综合", description: "商学、新闻强" },
  { name: "University of Texas at Dallas", shortName: "UTD", type: "公立", rank: 115, admissionRate: 85.0, tuition: 43298, location: "Richardson, TX", major: "CS", description: "CS性价比高" },
  { name: "University of Texas at Arlington", shortName: "UT Arlington", type: "公立", rank: 136, admissionRate: 88.0, tuition: 32260, location: "Arlington, TX", major: "CS", description: "CS、工程性价比高" },
  { name: "University of Houston", shortName: "UH", type: "公立", rank: 124, admissionRate: 85.0, tuition: 29200, location: "Houston, TX", major: "综合", description: "工程、商学强" },
  { name: "University of Iowa", shortName: "Iowa", type: "公立", rank: 89, admissionRate: 73.0, tuition: 33580, location: "Iowa City, IA", major: "综合", description: "写作、医学强" },
  { name: "University of Kansas", shortName: "Kansas", type: "公立", rank: 103, admissionRate: 80.0, tuition: 32460, location: "Lawrence, KS", major: "综合", description: "医学、工程强" },
  { name: "Kansas State University", shortName: "KSU", type: "公立", rank: 132, admissionRate: 88.0, tuition: 26640, location: "Manhattan, KS", major: "综合", description: "农业、工程强" },
  { name: "University of Missouri", shortName: "Mizzou", type: "公立", rank: 103, admissionRate: 79.0, tuition: 34248, location: "Columbia, MO", major: "综合", description: "新闻、工程强" },
  { name: "University of Nebraska-Lincoln", shortName: "Nebraska", type: "公立", rank: 124, admissionRate: 79.0, tuition: 33620, location: "Lincoln, NE", major: "综合", description: "工程、农业强" },
  { name: "University of Arkansas", shortName: "Arkansas", type: "公立", rank: 136, admissionRate: 79.0, tuition: 26960, location: "Fayetteville, AR", major: "综合", description: "工程、商学强" },
  { name: "University of Mississippi", shortName: "Ole Miss", type: "公立", rank: 136, admissionRate: 78.0, tuition: 28080, location: "University, MS", major: "综合", description: "医学、法律强" },
  { name: "University of Kentucky", shortName: "Kentucky", type: "公立", rank: 136, admissionRate: 78.0, tuition: 33180, location: "Lexington, KY", major: "综合", description: "医学、工程强" },
  { name: "University of Tennessee", shortName: "UTK", type: "公立", rank: 103, admissionRate: 67.0, tuition: 34190, location: "Knoxville, TN", major: "综合", description: "工程、商学强" },
  { name: "University of Oklahoma", shortName: "OU", type: "公立", rank: 124, admissionRate: 79.0, tuition: 30630, location: "Norman, OK", major: "综合", description: "气象、石油工程强" },
  { name: "Oklahoma State University", shortName: "OSU Stillwater", type: "公立", rank: 156, admissionRate: 85.0, tuition: 25460, location: "Stillwater, OK", major: "综合", description: "农业、工程强" },
  { name: "Washington State University", shortName: "WSU", type: "公立", rank: 156, admissionRate: 86.0, tuition: 31630, location: "Pullman, WA", major: "综合", description: "工程、农业强" },
  { name: "Oregon State University", shortName: "OSU Corvallis", type: "公立", rank: 136, admissionRate: 89.0, tuition: 33850, location: "Corvallis, OR", major: "综合", description: "工程、农业强" },
  { name: "University of Oregon", shortName: "UO", type: "公立", rank: 124, admissionRate: 80.0, tuition: 36830, location: "Eugene, OR", major: "综合", description: "新闻、生物强" },
  { name: "University of Colorado Boulder", shortName: "CU Boulder", type: "公立", rank: 105, admissionRate: 80.0, tuition: 40686, location: "Boulder, CO", major: "综合", description: "物理、大气科学顶尖" },
  { name: "University of Colorado Denver", shortName: "CU Denver", type: "公立", rank: 124, admissionRate: 71.0, tuition: 34730, location: "Denver, CO", major: "综合", description: "CS、商学强" },
  { name: "University of Alabama", shortName: "Alabama", type: "公立", rank: 124, admissionRate: 80.0, tuition: 31770, location: "Tuscaloosa, AL", major: "综合", description: "工程、商学强" },
  { name: "Auburn University", shortName: "Auburn", type: "公立", rank: 103, admissionRate: 74.0, tuition: 33300, location: "Auburn, AL", major: "综合", description: "工程、商学强" },
  { name: "University of South Carolina", shortName: "SC", type: "公立", rank: 103, admissionRate: 65.0, tuition: 34090, location: "Columbia, SC", major: "综合", description: "商学、工程强" },
  { name: "Louisiana State University", shortName: "LSU", type: "公立", rank: 156, admissionRate: 73.0, tuition: 29870, location: "Baton Rouge, LA", major: "综合", description: "工程、商学强" },
  { name: "Loyola University Chicago", shortName: "Loyola Chicago", type: "私立", rank: 105, admissionRate: 71.0, tuition: 52150, location: "Chicago, IL", major: "综合", description: "法学、医学强" },
  { name: "Marquette University", shortName: "Marquette", type: "私立", rank: 124, admissionRate: 87.0, tuition: 45460, location: "Milwaukee, WI", major: "综合", description: "医学、工程强" },
  { name: "University of Dayton", shortName: "Dayton", type: "私立", rank: 124, admissionRate: 76.0, tuition: 46370, location: "Dayton, OH", major: "综合", description: "工程、商学强" },
  { name: "University of Denver", shortName: "Denver", type: "私立", rank: 124, admissionRate: 51.0, tuition: 56120, location: "Denver, CO", major: "综合", description: "商学、法学强" },
  { name: "University of San Diego", shortName: "USD", type: "私立", rank: 105, admissionRate: 59.0, tuition: 57680, location: "San Diego, CA", major: "综合", description: "法学、商学强" },
  { name: "University of San Francisco", shortName: "USF", type: "私立", rank: 105, admissionRate: 71.0, tuition: 56640, location: "San Francisco, CA", major: "综合", description: "CS、护理强" },
  { name: "Santa Clara University", shortName: "Santa Clara", type: "私立", rank: 97, admissionRate: 54.0, tuition: 57460, location: "Santa Clara, CA", major: "综合", description: "工程、商学强" },
  { name: "Loyola Marymount University", shortName: "LMU", type: "私立", rank: 89, admissionRate: 41.0, tuition: 55830, location: "Los Angeles, CA", major: "综合", description: "电影、工程强" },
  { name: "Pepperdine University", shortName: "Pepperdine", type: "私立", rank: 80, admissionRate: 40.0, tuition: 62150, location: "Malibu, CA", major: "综合", description: "商学、法学强" },
  { name: "Villanova University", shortName: "Villanova", type: "私立", rank: 67, admissionRate: 23.0, tuition: 60970, location: "Villanova, PA", major: "综合", description: "商学、工程强" },
  { name: "Georgetown University", shortName: "Georgetown", type: "私立", rank: 22, admissionRate: 12.0, tuition: 63450, location: "Washington, DC", major: "综合", description: "国际关系、外交政策顶尖" },
  { name: "Syracuse University", shortName: "Syracuse", type: "私立", rank: 97, admissionRate: 52.0, tuition: 59830, location: "Syracuse, NY", major: "综合", description: "新闻、信息系统强" },
  { name: "Fordham University", shortName: "Fordham", type: "私立", rank: 89, admissionRate: 58.0, tuition: 57660, location: "New York, NY", major: "综合", description: "法学、商学强" },
  { name: "University of Miami", shortName: "Miami", type: "私立", rank: 80, admissionRate: 49.0, tuition: 57980, location: "Miami, FL", major: "综合", description: "医学、海洋科学强" },
  { name: "University of Rochester", shortName: "Rochester", type: "私立", rank: 44, admissionRate: 23.0, tuition: 61240, location: "Rochester, NY", major: "综合", description: "医学、光学、音乐强" },
  { name: "Brandeis University", shortName: "Brandeis", type: "私立", rank: 60, admissionRate: 39.0, tuition: 60240, location: "Waltham, MA", major: "综合", description: "生物化学、国际研究强" },
  { name: "Tufts University", shortName: "Tufts", type: "私立", rank: 44, admissionRate: 10.0, tuition: 65070, location: "Medford, MA", major: "综合", description: "医学、工程、国际关系强" },
  { name: "Lehigh University", shortName: "Lehigh", type: "私立", rank: 60, admissionRate: 34.0, tuition: 57770, location: "Bethlehem, PA", major: "综合", description: "工程、商学强" },
  { name: "University of Virginia", shortName: "UVA", type: "公立", rank: 24, admissionRate: 18.7, tuition: 56950, location: "Charlottesville, VA", major: "综合", description: "商学、法学顶尖" },

  // ==================== 英国大学 ====================
  { name: "University of Oxford", shortName: "Oxford", type: "公立", rank: 1, admissionRate: 17.0, tuition: 45000, location: "Oxford, UK", major: "综合", description: "英语世界最古老大学，医学、人文顶尖" },
  { name: "University of Cambridge", shortName: "Cambridge", type: "公立", rank: 2, admissionRate: 15.0, tuition: 48000, location: "Cambridge, UK", major: "综合", description: "工程、自然科学、数学顶尖" },
  { name: "Imperial College London", shortName: "ICL", type: "公立", rank: 3, admissionRate: 12.0, tuition: 42000, location: "London, UK", major: "工程", description: "工程、医学、CS顶尖" },
  { name: "University College London", shortName: "UCL", type: "公立", rank: 4, admissionRate: 15.0, tuition: 40000, location: "London, UK", major: "综合", description: "教育学、建筑学、医学强" },
  { name: "London School of Economics", shortName: "LSE", type: "公立", rank: 5, admissionRate: 8.0, tuition: 38000, location: "London, UK", major: "商科", description: "金融、经济学、社会科学全球第一" },
  { name: "University of Edinburgh", shortName: "Edinburgh", type: "公立", rank: 15, admissionRate: 30.0, tuition: 35000, location: "Edinburgh, UK", major: "综合", description: "医学、人工智能、文学强" },
  { name: "University of Manchester", shortName: "Manchester", type: "公立", rank: 32, admissionRate: 40.0, tuition: 32000, location: "Manchester, UK", major: "综合", description: "医学、工程、商学强" },
  { name: "King's College London", shortName: "KCL", type: "公立", rank: 40, admissionRate: 35.0, tuition: 38000, location: "London, UK", major: "综合", description: "医学、法学、护理强" },
  { name: "University of Bristol", shortName: "Bristol", type: "公立", rank: 55, admissionRate: 45.0, tuition: 32000, location: "Bristol, UK", major: "综合", description: "工程、社会科学强" },
  { name: "University of Warwick", shortName: "Warwick", type: "公立", rank: 64, admissionRate: 50.0, tuition: 31000, location: "Coventry, UK", major: "综合", description: "商学、数学、统计学强" },
  { name: "University of Durham", shortName: "Durham", type: "公立", rank: 78, admissionRate: 45.0, tuition: 30000, location: "Durham, UK", major: "综合", description: "法学、历史、哲学强" },
  { name: "University of Leeds", shortName: "Leeds", type: "公立", rank: 86, admissionRate: 55.0, tuition: 28000, location: "Leeds, UK", major: "综合", description: "医学、商学、工程强" },
  { name: "University of Birmingham", shortName: "Birmingham", type: "公立", rank: 92, admissionRate: 50.0, tuition: 28000, location: "Birmingham, UK", major: "综合", description: "医学、工程、商学强" },
  { name: "University of Southampton", shortName: "Southampton", type: "公立", rank: 97, admissionRate: 55.0, tuition: 28000, location: "Southampton, UK", major: "综合", description: "工程、医学、海事科学强" },
  { name: "University of Glasgow", shortName: "Glasgow", type: "公立", rank: 82, admissionRate: 50.0, tuition: 27000, location: "Glasgow, UK", major: "综合", description: "医学、兽医、法律强" },
  { name: "University of Sheffield", shortName: "Sheffield", type: "公立", rank: 104, admissionRate: 55.0, tuition: 26000, location: "Sheffield, UK", major: "综合", description: "工程、医学、社会科学强" },
  { name: "University of Liverpool", shortName: "Liverpool", type: "公立", rank: 130, admissionRate: 60.0, tuition: 25000, location: "Liverpool, UK", major: "综合", description: "医学、工程、商学强" },

  // ==================== 加拿大大学 ====================
  { name: "University of Toronto", shortName: "U of T", type: "公立", rank: 1, admissionRate: 43.0, tuition: 58000, location: "Toronto, ON", major: "综合", description: "医学、工程、商学顶尖" },
  { name: "McGill University", shortName: "McGill", type: "公立", rank: 2, admissionRate: 40.0, tuition: 55000, location: "Montreal, QC", major: "综合", description: "医学、法学、医学强" },
  { name: "University of British Columbia", shortName: "UBC", type: "公立", rank: 3, admissionRate: 50.0, tuition: 52000, location: "Vancouver, BC", major: "综合", description: "CS、工程、林学强" },
  { name: "University of Alberta", shortName: "Alberta", type: "公立", rank: 4, admissionRate: 55.0, tuition: 48000, location: "Edmonton, AB", major: "综合", description: "工程、医学、商学强" },
  { name: "University of Waterloo", shortName: "Waterloo", type: "公立", rank: 5, admissionRate: 53.0, tuition: 50000, location: "Waterloo, ON", major: "综合", description: "CS、工程、数学全球领先" },
  { name: "Western University", shortName: "Western", type: "公立", rank: 10, admissionRate: 58.0, tuition: 45000, location: "London, ON", major: "综合", description: "医学、商学、工程强" },
  { name: "University of Calgary", shortName: "Calgary", type: "公立", rank: 8, admissionRate: 60.0, tuition: 43000, location: "Calgary, AB", major: "综合", description: "工程、商学、石油工程强" },
  { name: "University of Ottawa", shortName: "Ottawa", type: "公立", rank: 7, admissionRate: 55.0, tuition: 42000, location: "Ottawa, ON", major: "综合", description: "法学、医学、工程强" },
  { name: "Queen's University", shortName: "Queen's", type: "公立", rank: 9, admissionRate: 50.0, tuition: 46000, location: "Kingston, ON", major: "综合", description: "商学、工程、医学强" },
  { name: "University of Montreal", shortName: "UdeM", type: "公立", rank: 6, admissionRate: 50.0, tuition: 44000, location: "Montreal, QC", major: "综合", description: "医学、法学、商学强" },
  { name: "McMaster University", shortName: "McMaster", type: "公立", rank: 11, admissionRate: 58.0, tuition: 44000, location: "Hamilton, ON", major: "综合", description: "医学、工程、CS强" },
  { name: "University of Victoria", shortName: "UVic", type: "公立", rank: 15, admissionRate: 65.0, tuition: 35000, location: "Victoria, BC", major: "综合", description: "CS、环境科学强" },
  { name: "Simon Fraser University", shortName: "SFU", type: "公立", rank: 13, admissionRate: 60.0, tuition: 36000, location: "Burnaby, BC", major: "综合", description: "CS、工程、商学强" },
  { name: "University of Saskatchewan", shortName: "Saskatchewan", type: "公立", rank: 20, admissionRate: 70.0, tuition: 36000, location: "Saskatoon, SK", major: "综合", description: "农业、医学、工程强" },
  { name: "York University", shortName: "York", type: "公立", rank: 18, admissionRate: 65.0, tuition: 38000, location: "Toronto, ON", major: "综合", description: "商学、法律、艺术强" },

  // ==================== 澳大利亚大学 ====================
  { name: "Australian National University", shortName: "ANU", type: "公立", rank: 1, admissionRate: 40.0, tuition: 48000, location: "Canberra, ACT", major: "综合", description: "政治、国际关系、研究强" },
  { name: "University of Melbourne", shortName: "Melbourne", type: "公立", rank: 2, admissionRate: 50.0, tuition: 46000, location: "Melbourne, VIC", major: "综合", description: "医学、法学、商学强" },
  { name: "University of Sydney", shortName: "Sydney", type: "公立", rank: 3, admissionRate: 55.0, tuition: 45000, location: "Sydney, NSW", major: "综合", description: "医学、工程、商学强" },
  { name: "University of Queensland", shortName: "UQ", type: "公立", rank: 4, admissionRate: 55.0, tuition: 44000, location: "Brisbane, QLD", major: "综合", description: "医学、生物科学、环境科学强" },
  { name: "Monash University", shortName: "Monash", type: "公立", rank: 5, admissionRate: 60.0, tuition: 43000, location: "Melbourne, VIC", major: "综合", description: "工程、医学、商学强" },
  { name: "University of New South Wales", shortName: "UNSW", type: "公立", rank: 6, admissionRate: 60.0, tuition: 44000, location: "Sydney, NSW", major: "综合", description: "工程、商学、法学强" },
  { name: "University of Adelaide", shortName: "Adelaide", type: "公立", rank: 8, admissionRate: 65.0, tuition: 42000, location: "Adelaide, SA", major: "综合", description: "医学、工程、商学强" },
  { name: "University of Western Australia", shortName: "UWA", type: "公立", rank: 7, admissionRate: 65.0, tuition: 42000, location: "Perth, WA", major: "综合", description: "医学、工程、环境科学强" },
  { name: "University of Technology Sydney", shortName: "UTS", type: "公立", rank: 10, admissionRate: 70.0, tuition: 40000, location: "Sydney, NSW", major: "综合", description: "CS、工程、护理强" },
  { name: "Macquarie University", shortName: "Macquarie", type: "公立", rank: 12, admissionRate: 75.0, tuition: 38000, location: "Sydney, NSW", major: "综合", description: "商学、CS、语言学强" },
  { name: "University of Canberra", shortName: "UC", type: "公立", rank: 15, admissionRate: 80.0, tuition: 35000, location: "Canberra, ACT", major: "综合", description: "法律、健康科学强" },

  // ==================== 香港大学 ====================
  { name: "The University of Hong Kong", shortName: "HKU", type: "公立", rank: 1, admissionRate: 20.0, tuition: 35000, location: "Hong Kong", major: "综合", description: "医学、法学、商学亚洲顶尖" },
  { name: "Chinese University of Hong Kong", shortName: "CUHK", type: "公立", rank: 2, admissionRate: 25.0, tuition: 34000, location: "Hong Kong", major: "综合", description: "商学、医学、翻译强" },
  { name: "Hong Kong University of Science and Technology", shortName: "HKUST", type: "公立", rank: 3, admissionRate: 22.0, tuition: 34000, location: "Hong Kong", major: "综合", description: "CS、工程、商学强" },
  { name: "City University of Hong Kong", shortName: "CityU", type: "公立", rank: 4, admissionRate: 30.0, tuition: 30000, location: "Hong Kong", major: "综合", description: "CS、工程、商学强" },
  { name: "Hong Kong Polytechnic University", shortName: "PolyU", type: "公立", rank: 5, admissionRate: 35.0, tuition: 28000, location: "Hong Kong", major: "综合", description: "工程、酒店管理、设计强" },
  { name: "Hong Kong Baptist University", shortName: "HKBU", type: "公立", rank: 6, admissionRate: 40.0, tuition: 26000, location: "Hong Kong", major: "综合", description: "传播学、艺术、传媒强" },

  // ==================== 新加坡大学 ====================
  { name: "National University of Singapore", shortName: "NUS", type: "公立", rank: 1, admissionRate: 15.0, tuition: 42000, location: "Singapore", major: "综合", description: "工程、医学、商学亚洲第一" },
  { name: "Nanyang Technological University", shortName: "NTU", type: "公立", rank: 2, admissionRate: 20.0, tuition: 40000, location: "Singapore", major: "工程", description: "工程、CS、材料科学强" },
  { name: "Singapore University of Technology and Design", shortName: "SUTD", type: "公立", rank: 3, admissionRate: 25.0, tuition: 38000, location: "Singapore", major: "工程", description: "设计、工程、CS强" },
  { name: "Singapore Management University", shortName: "SMU", type: "公立", rank: 4, admissionRate: 30.0, tuition: 36000, location: "Singapore", major: "商科", description: "商学、金融、会计强" },

];

// ============================================
// 学生数据库（存储历史数据用于分析）
// ============================================
const STUDENTS_DB_PATH = join(__dirname, 'students.json');

function loadStudents() {
  try {
    if (fs.existsSync(STUDENTS_DB_PATH)) {
      return JSON.parse(fs.readFileSync(STUDENTS_DB_PATH, 'utf8'));
    }
  } catch (e) {
    console.error('加载学生数据库失败:', e.message);
  }
  return { students: [] };
}

function saveStudents(data) {
  try {
    fs.writeFileSync(STUDENTS_DB_PATH, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('保存学生数据库失败:', e.message);
  }
}


// 根据专业类型检测programType
function detectGradProgramType(major) {
  const m = (major || '').toLowerCase();

  // === PhD 检测优先（避免被CS/MBA/Finance捕获）===
  if (m.includes('phd') || m.includes('博士')) {
    if (m.includes('stat') || m.includes('math') || m.includes('数学')) {
      return 'Math-PhD';
    }
    if (m.includes('econ') || m.includes('经济')) {
      return 'Econ-PhD';
    }
    return 'PhD';
  }

  // === CS/Software/AI 类 ===
  if (m.includes('cs') || m.includes('computer') || m.includes('软件') ||
      m.includes('人工智能') || m.includes('ai') || m.includes('machine learning') || m.includes('ml')) {
    return 'CS-Master';
  }

  // === Data Science / Analytics / Statistics ===
  if (m.includes('data') || m.includes('数据') || m.includes('analytics') ||
      m.includes('分析') || m.includes('statistics') || m.includes('统计')) {
    return 'DS-Analytics';
  }

  // === Cybersecurity / Security ===
  if (m.includes('cyber') || m.includes('安全') || m.includes('network security') ||
      m.includes('information security') || m.includes('密码学') || m.includes('security')) {
    return 'Cybersecurity';
  }

  // === Mechanical / Manufacturing / Vehicle / Automotive / Robotics ===
  // 机器人放在Mechanical而非ECE，因为更多属于机械类
  if (m.includes('mechanical') || m.includes('机械') ||
      m.includes('manufacturing') || m.includes('制造') || m.includes('vehicle') ||
      m.includes('车辆') || m.includes('automotive') || m.includes('航空') ||
      m.includes('robotics') || m.includes('机器人')) {
    return 'Mechanical';
  }

  // === ECE / Electrical / Electronic / VLSI / Semiconductor ===
  // 纯电子电气类，不含机器人（已归入Mechanical）
  if (m.includes('ee') || m.includes('electrical') || m.includes('electronic') ||
      m.includes('ece') || m.includes('电子') || m.includes('电气') ||
      m.includes('vlsi') || m.includes('芯片') || m.includes('semiconductor') || 
      m.includes('通信')) {
    return 'ECE';
  }

  // === Biomedical / Bioengineering ===
  if (m.includes('bme') || m.includes('biomedical') || m.includes('生物医学') ||
      m.includes('bioengineering') || m.includes('生物工程')) {
    return 'Biomedical';
  }

  // === Civil / Environmental ===
  if (m.includes('civil') || m.includes('environmental') || m.includes('土木') ||
      m.includes('环境') || m.includes('cee') || m.includes('建筑')) {
    return 'Civil-Env';
  }

  // === Chemical / Chemistry ===
  if (m.includes('chemical') || m.includes('化工') || m.includes('chemistry')) {
    return 'Chemical';
  }

  // === Marketing ===
  if (m.includes('marketing') || m.includes('市场') || m.includes('branding') ||
      m.includes('品牌')) {
    return 'Marketing';
  }

  // === OR / IE / Supply Chain ===
  if (m.includes('or') || m.includes('operations research') || m.includes('运筹') ||
      m.includes('ie') || m.includes('industrial') || m.includes('工业工程') ||
      m.includes('supply chain') || m.includes('供应链')) {
    return 'OR-IE';
  }

  // === MBA / Business Admin ===
  if (m.includes('mba') || m.includes('工商管理') || m.includes('商业分析')) {
    return 'MBA';
  }

  // === Finance / Financial ===
  if (m.includes('finance') || m.includes('金融') || m.includes('financial')) {
    return 'Finance';
  }

  // === Business Analytics ===
  if (m.includes('business analytics') || m.includes('商业分析')) {
    return 'Business-Analytics';
  }

  // === Public Health ===
  if (m.includes('public health') || m.includes('公共卫生') || m.includes('mph')) {
    return 'Public-Health';
  }

  // === Architecture / Urban Planning ===
  if (m.includes('architecture') || m.includes('建筑') || m.includes('urban') ||
      m.includes('城市规划') || m.includes('landscape') || m.includes('园林')) {
    return 'Architecture';
  }

  // === Law / LLM ===
  if (m.includes('law') || m.includes('法学') || m.includes('llm') || m.includes('jd')) {
    return 'Law-LLM';
  }

  // === Education ===
  if (m.includes('education') || m.includes('教育') || m.includes('teaching') ||
      m.includes('教学')) {
    return 'Education';
  }

  // === Neuroscience / Brain ===
  if (m.includes('neuro') || m.includes('神经') || m.includes('brain') || m.includes('认知')) {
    return 'Neuroscience';
  }

  // === PhD (before Finance/Econ check to avoid overlap) ===
  if (m.includes('phd') || m.includes('博士')) {
    // 进一步细分PhD类型
    if (m.includes('stat') || m.includes('数学') || m.includes('math')) {
      return 'Math-PhD';
    }
    if (m.includes('econ') || m.includes('经济')) {
      return 'Econ-PhD';
    }
    return 'PhD';
  }

  // === Economics (非PhD) ===
  if (m.includes('economics') || m.includes('经济') || m.includes('econom')) {
    return 'Finance'; // 经济学归属金融类
  }

  // === 默认为CS Master ===
  return 'CS-Master';
}

// 根据programType过滤研究生项目
function filterGradPrograms(programs, programType) {
  return programs.filter(p => p.programType === programType);
}

// ============================================
// 热门专业录取率数据库（低于学校整体录取率）
// 数据来源：学校官网 + Reddit/Quora真实数据 + USNEWS
// ============================================
const MAJOR_SPECIFIC_RATES = {
  // CS (计算机科学) - 最热门
  "computer science": {
    "Carnegie Mellon University": { rate: 5.5, note: "SCS学院整体，2024年约350/6400录取" },
    "MIT": { rate: 4.0, note: "EECS联合录取，约为整体录取率" },
    "Stanford University": { rate: 3.5, note: "CS单独申请，约为整体录取率" },
    "UC Berkeley": { rate: 2.3, note: "EECS 2024年Fall录取率" },
    "UIUC": { rate: 7.0, note: "CS+X项目，约24%含其他方向" },
    "Georgia Tech": { rate: 10.0, note: "College of Computing，含多个方向" },
    "University of Washington": { rate: 2.0, note: "外州生CS，极其竞争激烈" },
    "Cornell University": { rate: 6.0, note: "CS在工程学院内" },
    "Princeton University": { rate: 4.0, note: "CS via School of Engineering" },
    "University of Michigan": { rate: 8.0, note: "CS在工程学院" },
    "UT Austin": { rate: 10.0, note: "CS在工程学院内" },
    "Northeastern University": { rate: 8.0, note: "CS录取率" },
  },
  // Engineering (工程)
  "engineering": {
    "MIT": { rate: 3.0, note: "EECS联合录取，工程学院单独更高" },
    "Stanford University": { rate: 3.0, note: "Engineering学院，约为整体" },
    "UC Berkeley": { rate: 8.0, note: "工程学院整体" },
    "UIUC": { rate: 20.0, note: "工程学院整体，高于CS" },
    "Georgia Tech": { rate: 15.0, note: "工程学院整体，含CS" },
    "Cornell University": { rate: 8.0, note: "工程学院，CS和其他分开" },
    "University of Michigan": { rate: 15.0, note: "工程学院整体" },
    "Purdue University": { rate: 25.0, note: "工程学院整体，公立校较高" },
    "UT Austin": { rate: 20.0, note: "工程学院整体" },
  },
  // Business (商科)
  "business": {
    "University of Pennsylvania": { rate: 5.0, note: "Wharton商学院，远低于整体" },
    "MIT": { rate: 3.0, note: "Sloan商学院" },
    "Stanford University": { rate: 3.5, note: "GSB商学院" },
    "Northwestern University": { rate: 6.0, note: "Kellogg商学院" },
    "Duke University": { rate: 5.0, note: "Fuqua商学院" },
    "University of Michigan": { rate: 12.0, note: "Ross商学院" },
    "NYU - Stern": { rate: 7.0, note: "Stern商学院" },
    "Washington University in St. Louis": { rate: 10.0, note: "Olin商学院" },
    "University of Virginia": { rate: 15.0, note: "McIntire商学院" },
    "Notre Dame": { rate: 15.0, note: "Mendoza商学院" },
    "Emory University": { rate: 18.0, note: "Goizueta商学院" },
  },
  // Data Science / AI (数据科学/人工智能)
  "data science": {
    "MIT": { rate: 3.0, note: "EECS联合，DS作为方向" },
    "Stanford University": { rate: 3.5, note: "CS+AI方向" },
    "UC Berkeley": { rate: 3.0, note: "DS+CS联合录取" },
    "Carnegie Mellon University": { rate: 5.0, note: "ML+AI方向" },
    "University of Michigan": { rate: 10.0, note: "DS项目" },
  },
  // Pre-med / Biology (医学预科/生物)
  "pre-med": {
    "Johns Hopkins University": { rate: 5.0, note: "医学预科极竞争" },
    "Brown University": { rate: 5.0, note: "Program in Liberal Medical Education" },
    "Duke University": { rate: 5.0, note: "医学预科强" },
    "Emory University": { rate: 10.0, note: "医学预科强" },
    "University of Pennsylvania": { rate: 5.0, note: "医学预科强" },
  },
};

// 热门专业关键词（用于匹配学生输入的专业）
const HOT_MAJOR_KEYWORDS = {
  "computer science": ["cs", "computer science", "computer", "软件开发", "编程", "人工智能", "ai", "machine learning", "ml", "软件工程", "计算机科学", "计算机"],
  "engineering": ["engineering", "engineer", "工程", "机械", "电气", "土木", "化学工程", "mechanical", "electrical", "civil", "电子工程"],
  "business": ["business", "商学院", "finance", "accounting", "economics", "商科", "管理", "创业", "marketing", "金融", "会计", "市场营销", "营销"],
  "data science": ["data science", "ds", "数据分析", "statistics", "biostatistics", "数据科学", "analytics", "统计"],
  "pre-med": ["pre-med", "biology", "bio", "生物", "医学预科", "medical", "生命科学"],
  // 【优化】新增历史/政治/国际关系关键词
  "history": ["history", "历史", "历史学", "美国史", "世界史"],
  "political science": ["political science", "政治学", "政治", "government"],
  "international relations": ["international relations", "国际关系", "IR", "外交", "国际政治"],
};

// 检测学生专业是否为热门专业，返回热门专业类型或null
function detectHotMajor(majorInput) {
  if (!majorInput) return null;
  const lower = majorInput.toLowerCase();
  
  for (const [hotType, keywords] of Object.entries(HOT_MAJOR_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lower.includes(keyword)) {
        return hotType;
      }
    }
  }
  return null;
}

// 获取学校某专业的录取率（如果没有专业specific数据，返回null使用整体）
function getMajorAdjustedRate(schoolShortName, hotMajorType) {
  if (!hotMajorType) return null;
  const majorRates = MAJOR_SPECIFIC_RATES[hotMajorType];
  if (!majorRates) return null;
  
  // 先用shortName匹配
  let schoolData = majorRates[schoolShortName];
  
  // 如果没找到，尝试用全名匹配
  if (!schoolData) {
    const school = US_UNIVERSITIES_DB.find(s => s.shortName === schoolShortName);
    if (school) {
      schoolData = majorRates[school.name];
    }
  }
  
  if (!schoolData) return null;
  return schoolData.rate;
}

// ============================================
// 核心公式：综合分数计算（本科申请）
// ============================================
function calculateUndergradScore(profile) {
  const gpa = parseFloat(profile.gpa) || 3.0;
  const satScore = parseInt(profile.sat) || 0;
  const actScore = parseFloat(profile.act) || 0;
  const apCount = parseInt(profile.apCount) || 0;
  const honorsCount = parseInt(profile.honorsCourses) || 0;
  const hasLeadership = (profile.leadership || '').length > 10;
  const hasCommunityService = parseInt(profile.communityService || 0) > 20;
  const awardsCount = (profile.awards || '').split(',').filter(Boolean).length;
  const extracurricularsLen = (profile.extracurriculars || '').length;
  
  // 标准化SAT/ACT到百分制
  let testScoreNorm = 50; // 默认中等
  if (satScore > 0) {
    testScoreNorm = (satScore / 1600) * 100;
  } else if (actScore > 0) {
    testScoreNorm = (actScore / 36) * 100;
  }
  
  // 课程难度分数
  const courseRigor = Math.min(100, apCount * 8 + honorsCount * 5 + gpa * 10);
  
  // 学术分数（GPA换算）
  const academicScore = (gpa / 4.0) * 100;
  
  // 课外活动分数
  let activityScore = 30;
  if (hasLeadership) activityScore += 20;
  if (hasCommunityService) activityScore += 15;
  if (awardsCount > 0) activityScore += awardsCount * 10;
  if (extracurricularsLen > 50) activityScore += 15;
  activityScore = Math.min(100, activityScore);
  
  // 综合分数（按权重）
  const totalScore = 
    academicScore * 0.35 +
    testScoreNorm * 0.25 +
    courseRigor * 0.15 +
    activityScore * 0.15 +
    70 * 0.10; // 推荐信默认70分
  
  return {
    totalScore: Math.round(totalScore),
    academicScore: Math.round(academicScore),
    testScore: Math.round(testScoreNorm),
    courseRigor: Math.round(courseRigor),
    activityScore: Math.round(activityScore),
    recommendation: 70
  };
}

// ============================================
// 研究生评分计算（GRE/GMAT + 科研 + 论文）
// ============================================
function calculateGradScore(profile) {
  const gpa = parseFloat(profile.gpa) || 3.0;
  const greScore = parseInt(profile.gre) || 0; // GRE满分340
  const toeflScore = parseInt(profile.toefl) || 0;
  const researchYears = (profile.researchExperience || '').length > 0 
    ? Math.min(3, (profile.researchExperience.match(/\d+段|\d+年|\d+个月/g) || []).length + 1) 
    : 0;
  const publicationCount = (profile.publications || '').length > 0
    ? Math.min(5, (profile.publications.match(/\d+篇|论文|article|paper/gi) || []).length)
    : 0;
  const internshipMonths = (profile.internship || '').length > 0
    ? Math.min(24, (profile.internship.match(/\d+个月|\d+年/g) || []).length * 6 + 3)
    : 0;
  const recStrength = profile.recommendationStrength || '中';
  const schoolRank = profile.undergradSchoolRank || 50; // 本科学校排名加成
  
  // 1. 学术基础 GPA (25%) + 本科学校排名加成
  // 清华/北大(1-5) +15分, 复旦/上交(6-10) +12分, 浙大(11-20) +8分, 普通(21-50) +3分, 50名后无加成
  let schoolBonus = 0;
  if (schoolRank <= 5) schoolBonus = 15;
  else if (schoolRank <= 10) schoolBonus = 12;
  else if (schoolRank <= 20) schoolBonus = 8;
  else if (schoolRank <= 50) schoolBonus = 3;
  
  const academicScore = Math.min(100, (gpa / 4.0) * 100 + schoolBonus);
  
  // 2. GRE/GMAT (25%)
  // GRE: 340满分, 260保底; 330+为优秀, 320+为良好
  // GMAT: 800满分, 700+为优秀, 650+为良好
  let testScore = 50; // 默认
  const gmatScore = parseInt(profile.gmat) || 0;
  
  if (gmatScore > 0) {
    // GMAT评分 (转换为类似GRE的百分制)
    if (gmatScore >= 720) testScore = 95;
    else if (gmatScore >= 700) testScore = 85;
    else if (gmatScore >= 680) testScore = 75;
    else if (gmatScore >= 650) testScore = 65;
    else if (gmatScore >= 620) testScore = 55;
    else testScore = 45;
  } else if (greScore > 0) {
    // GRE评分
    if (greScore >= 330) testScore = 95;
    else if (greScore >= 325) testScore = 85;
    else if (greScore >= 320) testScore = 75;
    else if (greScore >= 315) testScore = 65;
    else if (greScore >= 310) testScore = 55;
    else testScore = 45;
  }
  
  // 3. 科研经历 (25%)
  // 科研段数 * 15 + 论文篇数 * 20 + 实习月数 * 2, 上限100
  const researchScore = Math.min(100, 
    researchYears * 15 + 
    publicationCount * 20 + 
    internshipMonths * 2
  );
  
  // 4. 推荐信 (15%)
  const recScore = recStrength === '强' ? 95 : recStrength === '中' ? 70 : 45;
  
  // 5. TOEFL英语成绩 (10%)
  let toeflScoreNorm = 80; // 默认
  if (toeflScore > 0) {
    if (toeflScore >= 110) toeflScoreNorm = 100;
    else if (toeflScore >= 105) toeflScoreNorm = 90;
    else if (toeflScore >= 100) toeflScoreNorm = 85;
    else if (toeflScore >= 90) toeflScoreNorm = 75;
    else toeflScoreNorm = 60;
  }
  
  // 综合分数
  const totalScore = 
    academicScore * 0.25 +
    testScore * 0.25 +
    researchScore * 0.25 +
    recScore * 0.15 +
    toeflScoreNorm * 0.10;
  
  return {
    totalScore: Math.round(totalScore),
    academicScore: Math.round(academicScore),
    testScore: Math.round(testScore),
    researchScore: Math.round(researchScore),
    recommendation: Math.round(recScore),
    toeflScore: Math.round(toeflScoreNorm)
  };
}

// 统一入口：根据申请类型选择评分函数
function calculateTotalScore(profile, applicationType) {
  if (applicationType === 'grad') {
    return calculateGradScore(profile);
  }
  return calculateUndergradScore(profile);
}

// ============================================
// 工具函数：从location获取国家
// ============================================
function getCountry(location) {
  if (!location) return '美国';
  if (location.includes('UK') || location.includes('London') || location.includes('Oxford') || location.includes('Cambridge') && location.includes('UK')) return '英国';
  if (location.includes('Canada') || location.includes('Vancouver') || location.includes('Toronto') || location.includes('BC')) return '加拿大';
  if (location.includes('Australia') || location.includes('Sydney') || location.includes('Melbourne')) return '澳大利亚';
  if (location.includes('Singapore')) return '新加坡';
  if (location.includes('Hong Kong') || location === 'Hong Kong') return '香港';
  if (location.includes('Japan') || location.includes('Tokyo')) return '日本';
  if (location.includes('Germany') || location.includes('Berlin') || location.includes('Munich')) return '德国';
  if (location.includes('France') || location.includes('Paris')) return '法国';
  if (location.includes('Netherlands') || location.includes('Amsterdam')) return '荷兰';
  if (location.includes('Switzerland') || location.includes('Zurich')) return '瑞士';
  return '美国'; // 默认为美国
}

// ============================================
// 工具函数：获取学校难度Tier
// ============================================
function getSchoolTier(rank, admissionRate) {
  // Tier 1: HYPSM级别 (rank 1-5, rate < 5%)
  if (rank <= 5 && admissionRate < 5) return 1;
  // Tier 2: Top 20 (rank 6-20, rate < 10%)
  if (rank <= 20 && admissionRate < 10) return 2;
  // Tier 3: Top 50 (rank 21-50, rate < 20%)
  if (rank <= 50 && admissionRate < 20) return 3;
  // Tier 4: Top 100 (rank 51-100)
  if (rank <= 100) return 4;
  // Tier 5: Others
  return 5;
}

// ============================================
// 核心公式：录取概率计算（新公式）
// ============================================
function calculateProbability(rate, score) {
  const R = rate / 100;
  const S = score;
  
  // 【优化v5】更线性的分数加成，80分=2.0倍，85分=2.5倍，90分=3.0倍，95分=3.5倍
  let scoreMultiplier;
  if (S < 60) {
    scoreMultiplier = 1 + (S - 50) * 0.02; // 50-60: 1.0-1.2
  } else if (S < 70) {
    scoreMultiplier = 1.2 + (S - 60) * 0.03; // 60-70: 1.2-1.5
  } else if (S < 80) {
    scoreMultiplier = 1.5 + (S - 70) * 0.05; // 70-80: 1.5-2.0
  } else if (S < 85) {
    scoreMultiplier = 2.0 + (S - 80) * 0.1; // 80-85: 2.0-2.5
  } else if (S < 90) {
    scoreMultiplier = 2.5 + (S - 85) * 0.1; // 85-90: 2.5-3.0
  } else {
    scoreMultiplier = 3.0 + (S - 90) * 0.1; // 90+: 3.0-4.0
  }
  
  let probability = R * scoreMultiplier;
  
  // 【优化】对极高分数学生放宽上限（90+）
  let maxMultiplier;
  if (S >= 90) {
    // 超高分学生：顶级学校最高可达3.5倍
    if (R < 0.05) maxMultiplier = 3.5;
    else if (R < 0.10) maxMultiplier = 3.0;
    else if (R < 0.20) maxMultiplier = 2.2;
    else maxMultiplier = 1.6;
  } else {
    if (R < 0.05) maxMultiplier = 2.2;
    else if (R < 0.10) maxMultiplier = 1.9;
    else if (R < 0.20) maxMultiplier = 1.6;
    else maxMultiplier = 1.4;
  }
  
  probability = Math.min(probability, R * maxMultiplier);
  probability = Math.max(probability, R * 0.6); // 最低0.6倍
  
  // 转换为百分比（保留1位小数）
  return Math.round(probability * 1000) / 10;
}

// ============================================
// 分类判断（Reach/Match/Safety）
// ============================================
function categorizeSchool(rate, score) {
  const R = rate / 100;
  const S = score;
  
  // 极低分学生（<50分）：只推荐保底校
  if (S < 50) {
    return 'safety';
  }
  
  // 低分学生（50-60分）：冲刺校概率极低，只推荐Match和Safety
  if (S < 60) {
    if (R >= 0.30) {
      return 'safety';
    }
    return 'match';
  }
  
  // 正常分数（60+分）使用原有逻辑
  let baseProbability = R * (1 + (S - 50) / 100);
  
  if (R < 0.15) {
    // 冲刺校（<15%录取率）
    const threshold = R * 1.5; // 概率超过2倍录取率为Match
    if (baseProbability > threshold && S >= 75) {
      return 'match';
    }
    return 'reach';
  } else if (R < 0.50) {
    // 匹配校（15-50%录取率）
    if (baseProbability > R * 1.5) {
      return 'safety';
    }
    return 'match';
  } else {
    // 保底校（>=50%录取率）
    return 'safety';
  }
}

// ============================================
// API: 生成选校报告
// ============================================
app.post('/api/generate-report', async (req, res) => {
  try {
    const { profile, applicationType } = req.body;
    
    if (!profile) {
      return res.status(400).json({ error: '缺少学生信息' });
    }

    console.log('🔄 处理选校报告请求...');
    console.log('学生:', profile.name || '未填写');
    console.log('申请类型:', applicationType === 'grad' ? '研究生' : '本科');

    // 计算综合分数（根据申请类型选择评分体系）
    const scoreBreakdown = calculateTotalScore(profile, applicationType);
    const totalScore = scoreBreakdown.totalScore;
    
    console.log('📊 综合分数:', totalScore);
    if (applicationType === 'grad') {
      console.log('   - 学术(GPA):', scoreBreakdown.academicScore);
      console.log('   - GRE:', scoreBreakdown.testScore);
      console.log('   - 科研:', scoreBreakdown.researchScore);
      console.log('   - 推荐信:', scoreBreakdown.recommendation);
      console.log('   - TOEFL:', scoreBreakdown.toeflScore);
    } else {
      console.log('   - 学术:', scoreBreakdown.academicScore);
      console.log('   - 考试:', scoreBreakdown.testScore);
      console.log('   - 课程难度:', scoreBreakdown.courseRigor);
      console.log('   - 活动:', scoreBreakdown.activityScore);
      console.log('   - 推荐信:', scoreBreakdown.recommendation);
    }

    // 检测学生专业是否为热门专业
    const studentMajor = profile.major || '';
    const hotMajorType = detectHotMajor(studentMajor);
    console.log('🎯 目标专业:', studentMajor, hotMajorType ? `(热门: ${hotMajorType})` : '(普通)');

    // 获取过滤参数
    const targetCountries = profile.targetCountries || ['美国'];
    const includeLiberalArts = profile.includeLiberalArts !== false; // 默认为true
    console.log('🌍 目标国家:', targetCountries.join(', '));
    console.log('📚 包含文理学院:', includeLiberalArts);

    // 分类选校（根据申请类型选择数据库）
    const reachSchools = [];
    const matchSchools = [];
    const safetySchools = [];
    
    // 根据申请类型选择学校数据库
    let schoolDB;
    let isGradApplication = applicationType === 'grad';
    
    // 根据专业确定合适的学校类型（仅本科）
    // 包含文理学院的强项专业（历史/文学/哲学）也要明确列出，避免误过滤
    const MAJOR_SUITABLE_TYPES = {
      'computer science': ['工程', 'CS', '综合', '私立'],
      'engineering': ['工程', '综合', '私立'],
      'data science': ['工程', 'CS', '综合', '私立'],
      'pre-med': ['综合', '医学', '私立'],
      'business': ['综合', '商学院', '私立'],
      // 【优化】营销/管理/MBA专业：推荐商学院和综合大学，不推荐文理学院
      'marketing': ['综合', '商学院', '私立'],
      'management': ['综合', '商学院', '私立'],
      'economics': ['综合', '私立', '文理学院'],  // 经济文理学院也很强
      // 【优化】历史/政治/国际关系：文理学院是强项，但仍可推荐综合大学
      'history': ['综合', '私立', '文理学院'],
      'political science': ['综合', '私立', '文理学院'],
      'international relations': ['综合', '私立', '文理学院'],
    };
    const suitableTypes = isGradApplication ? null : (MAJOR_SUITABLE_TYPES[hotMajorType] || null);
    let programType = 'CS-Master'; // 默认
    
    if (isGradApplication) {
      programType = detectGradProgramType(profile.major);
      schoolDB = filterGradPrograms(GRAD_PROGRAMS_DB, programType);
      console.log('🎓 研究生项目类型:', programType, '- 候选学校:', schoolDB.length, '所');
    } else {
      schoolDB = US_UNIVERSITIES_DB;
    }

    for (const school of schoolDB) {
      // 1. 国家过滤
      const schoolCountry = getCountry(school.location);
      if (!targetCountries.includes(schoolCountry)) {
        continue; // 跳过不在目标国家的学校
      }
      
      // 2. 文理学院过滤（仅本科）
      if (!isGradApplication && !includeLiberalArts && school.type === '文理学院') {
        continue; // 跳过文理学院
      }
      
      // 3. 学校类型过滤（根据专业适配）
      // 如果专业有suitableTypes设置，则只推荐匹配类型的学校
      // CS/工程/商科/营销/管理 → 不推荐文理学院
      // 历史/经济/政治 → 文理学院是强项，保留
      if (!isGradApplication && suitableTypes && !suitableTypes.includes(school.type)) {
        continue; // 跳过不适合该专业的学校类型
      }

      // 获取实际使用的录取率
      const effectiveRate = isGradApplication 
        ? school.admissionRate // 研究生项目直接使用项目的录取率
        : (getMajorAdjustedRate(school.shortName, hotMajorType) || school.admissionRate);
      const usedMajorSpecificRate = !isGradApplication && effectiveRate !== school.admissionRate;
      
      // 计算概率和分类
      const probability = calculateProbability(effectiveRate, totalScore);
      
      // 研究生项目使用program rank，本科使用school rank
      const tier = isGradApplication 
        ? getSchoolTier(school.rank, school.admissionRate) // 研究生项目Tier
        : getSchoolTier(school.rank, school.admissionRate); // 本科Tier
      
      const schoolResult = {
        name: school.name,
        shortName: school.shortName,
        type: school.type,
        rank: school.rank,
        tier: tier,
        admissionRate: school.admissionRate,
        effectiveRate: effectiveRate,
        usedMajorSpecificRate: usedMajorSpecificRate,
        tuition: school.tuition,
        location: school.location,
        country: schoolCountry,
        major: school.major || school.programType || programType,
        description: school.description,
        admissionProbability: probability,
        whyCategory: isGradApplication
          ? `综合分数${totalScore}分，${school.programType || '硕士'}项目录取概率${probability}%（项目录取率${school.admissionRate}%）`
          : (usedMajorSpecificRate 
              ? `综合分数${totalScore}分，${hotMajorType}专业录取概率${probability}%（专用录取率${effectiveRate}%，低于整体${school.admissionRate}%）`
              : `综合分数${totalScore}分，录取概率${probability}%（整体录取率${school.admissionRate}%）`)
      };
      
      // 分类逻辑：直接用概率阈值
      // 【优化】研究生项目：reach阈值降低到2%，让更多顶级项目进入冲刺
      // 60+分学生：reach<2%, match 2-25%, safety>25%
      // 如果reach学校不足2所，从match中补足（研究生数据库项目少，需要灵活处理）
      let category;
      if (totalScore < 50) {
        category = 'safety';
      } else if (totalScore < 60) {
        if (probability > 20) category = 'safety';
        else if (probability > 8) category = 'match';
        else category = 'reach';
      } else {
        if (probability > 25) category = 'safety';
        else if (probability > (isGradApplication ? 2 : 6)) category = 'match';  // 研究生2%, 本科6%
        else category = 'reach';
      }
      
      if (category === 'safety') {
        safetySchools.push(schoolResult);
      } else if (category === 'match') {
        matchSchools.push(schoolResult);
      } else {
        reachSchools.push(schoolResult);
      }
    }

    // 按Tier和概率排序（冲刺：Tier优先，Tier相同则概率高的在前；匹配/保底：概率低的在前）
    reachSchools.sort((a, b) => {
      // 先按Tier排序（Tier小的在前 = 排名更高的学校）
      if (a.tier !== b.tier) return a.tier - b.tier;
      // Tier相同时按概率从高到低
      return b.admissionProbability - a.admissionProbability;
    });
    matchSchools.sort((a, b) => a.admissionProbability - b.admissionProbability);
    safetySchools.sort((a, b) => a.admissionProbability - b.admissionProbability);

    // 【优化】降低Tier1门槛，让80+分学生能看到更多顶尖学校
    const getReachLimits = (score) => {
      if (score >= 95) return { tier1: 4, tier2: 2, tier3: 1, total: 7 };
      if (score >= 90) return { tier1: 3, tier2: 2, tier3: 1, total: 6 };
      if (score >= 85) return { tier1: 3, tier2: 2, tier3: 1, total: 6 };
      if (score >= 80) return { tier1: 2, tier2: 2, tier3: 1, total: 5 };
      if (score >= 75) return { tier1: 2, tier2: 2, tier3: 1, total: 5 };
      return { tier1: 1, tier2: 2, tier3: 1, total: 4 };
    };
    const limits = getReachLimits(totalScore);
    
    const selectDiverse = (schools) => {
      const tierCount = {};
      const result = [];
      for (const school of schools) {
        const t = school.tier;
        tierCount[t] = tierCount[t] || 0;
        
        // 根据Tier限制数量
        const maxForTier = t === 1 ? limits.tier1 : t === 2 ? limits.tier2 : t === 3 ? limits.tier3 : 2;
        
        if (tierCount[t] < maxForTier) {
          result.push(school);
          tierCount[t]++;
        }
        if (result.length >= limits.total) break;
      }
      return result;
    };

    const finalReach = selectDiverse(reachSchools);
    const finalMatch = selectDiverse(matchSchools);
    const finalSafety = safetySchools.slice(0, 4);

    // 【优化】研究生项目：如果冲刺校不足2所，从匹配校补足（不删除match中的学校）
    // 研究生项目数据库项目较少，需要灵活处理
    if (isGradApplication && finalReach.length < 2 && matchSchools.length >= 2) {
      const supplement = matchSchools.slice(0, 2 - finalReach.length);
      finalReach.push(...supplement);
      // 注意：不从match中删除，让同一学校可以同时出现在reach和match（显示在reach分组）
    }

    const reportData = {
      student: {
        name: profile.name || '学生',
        school: profile.school || '未填写',
        gpa: profile.gpa || '未填写',
        sat: profile.sat || profile.act || '未填写',
        toefl: profile.toefl || '未填写',
        targetCountries: (profile.targetCountries || ['美国']).join('、'),
        major: profile.major || '计算机科学',
        budget: profile.budget || '80'
      },
      scoreBreakdown,
      hotMajorType: hotMajorType,
      summary: hotMajorType 
        ? `综合分数${totalScore}分，在美国${profile.major || 'CS'}申请（热门专业）中具有竞争力。已启用${hotMajorType}专业专用录取率计算。`
        : `综合分数${totalScore}分，在美国${profile.major || '计算机科学'}申请中具有较强竞争力。建议采取冲刺+匹配+保底的策略。`,
      reach: finalReach,
      match: finalMatch,
      safety: finalSafety,
      strategy: {
        ed: `ED建议选择冲刺校中概率最高的${finalReach[0]?.shortName || '某校'}（${finalReach[0]?.admissionProbability || 0}%）`,
        ea: `EA建议选择匹配校，如${finalMatch[0]?.shortName || '某校'}`,
        rd: `RD多所匹配和保底校确保录取`,
        overall: `冲刺${finalReach.length}所+匹配${finalMatch.length}所+保底${finalSafety.length}所，全面覆盖`
      },
      stats: {
        totalSchools: finalReach.length + finalMatch.length + finalSafety.length,
        reachCount: finalReach.length,
        matchCount: finalMatch.length,
        safetyCount: finalSafety.length
      }
    };

    // 保存学生数据
    const db = loadStudents();
    db.students.push({
      ...profile,
      scoreBreakdown,
      reportDate: new Date().toISOString(),
      report: reportData
    });
    saveStudents(db);
    console.log('✅ 学生数据已保存');

    res.json({
      success: true,
      data: reportData,
      note: `基于《Admission Matters》+ 新概率公式，可选学校库涵盖${US_UNIVERSITIES_DB.length}所美国大学`
    });

  } catch (error) {
    console.error('❌ 报告生成失败:', error.message);
    res.status(500).json({
      success: false,
      error: error.message || '生成失败'
    });
  }
});

// API: 获取大学列表
app.get('/api/universities', (req, res) => {
  const universities = US_UNIVERSITIES_DB.map(u => ({
    name: u.name,
    shortName: u.shortName,
    type: u.type,
    rank: u.rank,
    admissionRate: u.admissionRate,
    tuition: u.tuition,
    location: u.location
  }));
  res.json({
    count: universities.length,
    universities
  });
});

// API: 获取学生历史数据
app.get('/api/students', (req, res) => {
  const db = loadStudents();
  res.json({
    count: db.students.length,
    students: db.students.map(s => ({
      name: s.name,
      school: s.school,
      gpa: s.gpa,
      sat: s.sat,
      reportDate: s.reportDate
    }))
  });
});

// API: 健康检查
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    time: new Date().toISOString(),
    universities: US_UNIVERSITIES_DB.length,
    students: loadStudents().students.length
  });
});

// SPA fallback - serve index.html for all non-API routes
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, '../client/dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`\n🚀 留学AI服务器已启动`);
  console.log(`   http://localhost:${PORT}`);
  console.log(`   大学数据库: ${US_UNIVERSITIES_DB.length}所`);
  console.log(`   概率公式: 新公式（基准×系数）\n`);
});
