import fs from 'fs';
import path from 'path';

// Mock functions to simulate data fetching
const fetchPages = async () => [/* mocked CMS pages */];
const fetchSiteSettings = async () => ({/* mocked site settings */});
const fetchProducts = async () => [/* mocked products */];
const fetchCategories = async () => [/* mocked categories */];
const fetchBlogs = async () => [/* mocked blogs */];
const fetchStats = async () => ({/* mocked stats */});

const exportData = async () => {
  try {
    const dataDir = path.join(__dirname, '..', 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir);
    }

    const pages = await fetchPages();
    const siteSettings = await fetchSiteSettings();
    const products = await fetchProducts();
    const categories = await fetchCategories();
    const blogs = await fetchBlogs();
    const stats = await fetchStats();

    fs.writeFileSync(path.join(dataDir, 'pages.json'), JSON.stringify(pages, null, 2));
    fs.writeFileSync(path.join(dataDir, 'site-settings.json'), JSON.stringify(siteSettings, null, 2));
    fs.writeFileSync(path.join(dataDir, 'products.json'), JSON.stringify(products, null, 2));
    fs.writeFileSync(path.join(dataDir, 'categories.json'), JSON.stringify(categories, null, 2));
    fs.writeFileSync(path.join(dataDir, 'blogs.json'), JSON.stringify(blogs, null, 2));
    fs.writeFileSync(path.join(dataDir, 'stats.json'), JSON.stringify(stats, null, 2));

    console.log('Data exported successfully to data/ directory.');
  } catch (error) {
    console.error('Error exporting data:', error);
  }
};

exportData();
