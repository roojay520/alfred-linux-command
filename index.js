const alfy = require('alfy');
const Fuse = require('fuse.js');
const alfredNotifier = require('alfred-notifier');

alfredNotifier();

/**
 * @description 模糊搜索
 * @param {array} list 需要匹配的列表
 * @param {string} [input=alfy.input] 用户输入
 * @return {array} 匹配结果列表
 */
function fuzzySearch(list, input = alfy.input) {
  const options = { threshold: 0.4, keys: [ 'n', 'd' ] };
  const fuse = new Fuse(list, options);
  const items = fuse.search(input);
  return items.map(({ item }) => ({ title: item.n, subtitle: item.d }));
}

const DATA_URL = 'https://cdn.jsdelivr.net/npm/linux-command@latest/dist/data.json';
alfy.fetch(DATA_URL, {
  maxAge: 1000 * 60 * 60 * 24, // 缓存 24 小时
  transform: body => Object.values(body)
})
  .then(data => fuzzySearch(data))
  .then(items => alfy.output(items))
  .catch(error => { alfy.cache.clear(); alfy.log(error); });
