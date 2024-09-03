const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  CLIENT: 'client',
  CLIENT_USER: 'clientUser',
  FINANCIAL: 'financial',
  GUEST: 'guest',
  SYSTEM: 'system',
  SALES: 'sales',
  MP_USER: 'mpUser',
  TECH: 'tech',
};

const CAMPAIGNTYPE = {
  ON_SITE_REFERRAL: 'on_site_referral',
  MARKETPLACE: 'marketplace',
};

const COUNTRIES = [
  { countryName: 'Argentina', identifier: 'argentina', countryCode: 'AR' },
  { countryName: 'Austria', identifier: 'austria', countryCode: 'AT' },
  { countryName: 'Australia', identifier: 'australia', countryCode: 'AU' },
  { countryName: 'Belgium', identifier: 'belgium', countryCode: 'BE' },
  { countryName: 'Brazil', identifier: 'brazil', countryCode: 'BR' },
  { countryName: 'Canada', identifier: 'canada', countryCode: 'CA' },
  {
    countryName: 'Switzerland',
    identifier: 'switzerland',
    countryCode: 'CH',
  },
  { countryName: 'Chile', identifier: 'chile', countryCode: 'CL' },
  { countryName: 'Colombia', identifier: 'colombia', countryCode: 'CO' },
  { countryName: 'Germany', identifier: 'germany', countryCode: 'DE' },
  { countryName: 'Denmark', identifier: 'denmark', countryCode: 'DK' },
  { countryName: 'Estonia', identifier: 'estonia', countryCode: 'EE' },
  { countryName: 'Spain', identifier: 'spain', countryCode: 'ES' },
  {
    countryName: 'Other Europe',
    identifier: 'other_europe',
    countryCode: 'EU',
  },
  { countryName: 'Finland', identifier: 'finland', countryCode: 'FI' },
  { countryName: 'France', identifier: 'france', countryCode: 'FR' },
  { countryName: 'Hong Kong', identifier: 'hong_kong', countryCode: 'HK' },
  { countryName: 'Croatia', identifier: 'croatia', countryCode: 'HR' },
  { countryName: 'Hungary', identifier: 'hungary', countryCode: 'HU' },
  { countryName: 'Ireland', identifier: 'ireland', countryCode: 'IE' },
  { countryName: 'Italy', identifier: 'italy', countryCode: 'IT' },
  { countryName: 'Lithuania', identifier: 'lithuania', countryCode: 'LT' },
  { countryName: 'Latvia', identifier: 'latvia', countryCode: 'LV' },
  { countryName: 'Mexico', identifier: 'mexico', countryCode: 'MX' },
  {
    countryName: 'Netherlands',
    identifier: 'netherlands',
    countryCode: 'NL',
  },
  { countryName: 'Norway', identifier: 'norway', countryCode: 'NO' },
  {
    countryName: 'New Zealand',
    identifier: 'new_zealand',
    countryCode: 'NZ',
  },
  { countryName: 'Peru', identifier: 'peru', countryCode: 'PE' },
  { countryName: 'Poland', identifier: 'poland', countryCode: 'PL' },
  { countryName: 'Romania', identifier: 'romania', countryCode: 'RO' },
  { countryName: 'Russia', identifier: 'russia', countryCode: 'RU' },
  { countryName: 'Singapore', identifier: 'singapore', countryCode: 'SGP' },
  { countryName: 'Slovenia', identifier: 'slovenia', countryCode: 'SVN' },
  { countryName: 'Sweden', identifier: 'sweden', countryCode: 'SWE' },
  {
    countryName: 'Great Britain',
    identifier: 'great_britain',
    countryCode: 'UK',
  },
  {
    countryName: 'United States',
    identifier: 'united_states',
    countryCode: 'USA',
  },
];

const SUMMARY_SKELETON_BASE = [{
  id: 1,
  title: '',
  valueRow: '',
  valueRowCompare: '',
  percentValue: '',
  icon: null,
},
{
  id: 2,
  title: '',
  valueRow: '',
  valueRowCompare: '',
  percentValue: '',
  icon: null,
},
{
  id: 3,
  title: '',
  valueRow: '',
  valueRowCompare: '',
  percentValue: '',
  icon: null,
},
{
  id: 4,
  title: '',
  valueRow: '',
  valueRowCompare: '',
  percentValue: '',
  icon: null,
}];

const MENU_ADMIN_ITEMS = [
  {
    id: 1, name: 'Global Dashboard', submenu: 'statistics', link: '/admin/dashboard',
  },
  {
    id: 2, name: 'Client Overview', submenu: 'statistics', link: '/admin/client',
  },
  {
    id: 3, name: 'Legacy Dashboard', submenu: 'statistics', link: 'https://app.soreto.com',
  },
  {
    id: 7, name: 'Logout', submenu: 'tools', link: '/logout',
  },
];

const SUB_MENU_ITEMS = [
  { id: 1, name: 'statistics' },
  { id: 2, name: 'tools' },
];

const PERFORMANCE_KPI_FILTER_ITEMS = [
  { id: 1, label: 'Revenue', key: 'revenue' },
  { id: 2, label: 'Commission', key: 'commissionSum' },
  { id: 3, label: 'Sales', key: 'orderCount' },
];

export default {
  ROLES,
  CAMPAIGNTYPE,
  COUNTRIES,
  SUMMARY_SKELETON_BASE,
  MENU_ADMIN_ITEMS,
  SUB_MENU_ITEMS,
  PERFORMANCE_KPI_FILTER_ITEMS,
};
