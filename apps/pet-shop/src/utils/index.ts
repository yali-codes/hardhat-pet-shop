/**
 * @description 简单深拷贝一个对象，里面不包含正则，function等特殊对象
 * @param {Object} obj 要拷贝的对象
 * @return {object} 拷贝后的对象
 */
export function simpleDeepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * 判断是否是对象
 * @param {Object|null} obj 要检测的对象数据
 * @return {Boolean} true or false
 */
export function isObject<T>(obj: T): boolean {
  return typeof obj === 'object' && obj !== null;
}

/**
 * @description 深拷贝，适合所有数据类型
 * @param {object} source 数据源
 * @param {WeakMap} source 弱map结构
 * @return {object} 拷贝后的对象
 */
export function deepClone<T>(source: T, hash: WeakMap<any, any> = new WeakMap()) {
  if (!isObject(source)) return source;
  if (hash.has(source)) return hash.get(source);

  const target: any = Array.isArray(source) ? [] : {};
  hash.set(source, target);

  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      target[key] = deepClone(source[key], hash);
    }
  }
  return target;
}

export function parseSearch(): URLSearchParams | null {
  const _hash = location.hash;
  const _search = location.search;
  const _result = _search || _hash;
  const _searchParams = _result.slice(_result.indexOf('?') + 1);
  return _searchParams ? new URLSearchParams(_searchParams) : null;
}

/**
 * @description: 将驼峰字符转换为下横线格式
 * @param {String} str 需要转换的字符串
 * @return {String} 转换后的字符
 */
export function toLowerLine(str: string): string {
  let _temp = str.replace(/[A-Z]/g, match => '_' + match.toLowerCase());
  // 如果首字母是大写，执行replace时会多一个_，这里需要去掉
  _temp.slice(0, 1) === '_' && (_temp = _temp.slice(1));
  return _temp;
}

/**
 * @description: 将下横线字符转换为驼峰格式
 * @param {String} str 需要转换的字符串
 * @return {type} 转换后的字符
 */
export function toHump(str: string): string {
  return str.replace(/([^_])(?:_+([^_]))/g, ($0, $1, $2) => $1 + $2.toUpperCase());
}

/**
 * @description: url特殊字符替换
 * @param {String} str 字符串
 * @param {RegExp} reg 正则表达式
 * @param {Object} replaceMap 字符替换的映射表
 * @return {String} 返回替换后的字符
 */
export function superUrlRepalce(str: string, reg: RegExp, replaceMap: Object & any): string {
  const _keys = Object.keys(replaceMap);
  return str.replace(reg, result => {
    const _matchedStr = _keys.find(key => key === result);
    return _matchedStr ? replaceMap[_matchedStr] : result;
  });
}

export function flattenTree<T>(tree: T[], { childrenName = 'children' } = {}): T[] {
  if (!tree || !(tree && Array.isArray(tree))) {
    throw new Error(`The multArray should be array.`);
  }

  let _list: T[] = [];
  const _copyedTree = simpleDeepClone(tree);
  for (let i = 0; i < _copyedTree.length; i++) {
    const _item: T & any = _copyedTree[i];
    if (Array.isArray(_item)) {
      _list = _list.concat(flattenTree(_item));
    } else {
      let _copyedChildren = [];
      if (_item[childrenName]) {
        _copyedChildren = JSON.parse(JSON.stringify(_item[childrenName]));
        delete _item[childrenName];
      }

      _list.push(_item);
      if (_copyedChildren.length) {
        _list = _list.concat(flattenTree(_copyedChildren));
      }
    }
  }
  return _list;
}

/**
 * @description: 格式化成树，也就是添加一个key, isLeaf,nodePid,nodeParentPid字段
 * @param {Array} tree 需要处理的关系数组
 * @return {Array} 返回格式后的树
 */
export function formatTree<T>(tree: T[], { preKey = '1', keyScope = '', titleScope = '', isTitleScope = false } = {}) {
  if (!Array.isArray(tree)) {
    throw new Error('The list should be araay');
  }

  if (!tree.length) return tree;

  const _newList = tree.map((elem: T & any, index) => {
    elem['key'] = `${preKey}-${index}`;
    elem['nodePid'] = Number(elem['key'].replace(/-/g, ''));
    elem['nodeParentPid'] = preKey.indexOf('-') > -1 ? Number(preKey.replace(/-/g, '')) : null;
    elem.isLeaf = !elem.children;

    // 处理 title 的作用域链
    if (isTitleScope) {
      elem.titleScope = titleScope ? [...titleScope, elem.title] : [elem.title];
    }

    // 处理 key 的作用域链
    elem.keyScope = keyScope ? [...keyScope, elem.key] : [elem.key];

    if (elem.children) {
      const { key, titleScope, keyScope } = elem;
      formatTree(elem.children, {
        preKey: key,
        keyScope,
        titleScope,
        isTitleScope,
      });
    }
    return elem;
  });

  return _newList;
}

export function findNodeFromTreeByPid<T>(tree: T[], pid: number, { id = 'pid', children = 'children' } = {}) {
  let _node = null;
  const _findNode = (tree: T[], pid: number) => {
    simpleDeepClone(tree).forEach((node: T & any) => {
      if (node[id] === pid) {
        _node = node;
      } else {
        if (node[children]) {
          _findNode(node[children], pid);
        }
      }
    });
  };

  _findNode(tree, pid);
  return _node;
}

/**
 * @description: 将有层级关系的多个数组转成一个数组
 * @param {Array} arrs 多个数组
 * @return {Array} 返回子父级关系的数组
 */
export function createRelatedArrayFromHierachicalArray<T, K>(arrs: T[], staticChildrenLeafNodes: K[]) {
  let _startIndex = arrs.length - 1;
  let _tree: any = arrs[_startIndex];

  // 添加静态的children对象
  if (staticChildrenLeafNodes && staticChildrenLeafNodes.length) {
    _tree.forEach((elem: T & any) => {
      const _elem = simpleDeepClone(elem);
      _elem.children && delete _elem.children;
      elem.children = staticChildrenLeafNodes.map(staticNode => ({
        ...staticNode,
        parentNode: _elem,
      }));
    });
  }

  if (arrs.length === 1) return _tree;

  /**
   * @description: 用父级数组和子级数组生成一个children
   * @param {Array} parents 父级数组
   * @param {Array} children 子级数组
   * @return {Array} 返回有关联关系的二维数组
   */
  const _genChildren: Function = <T>(parents: T[], children: T[], index: number) => {
    let _children: T[] = simpleDeepClone(children);
    const _parents = simpleDeepClone(parents);

    _parents.forEach((parent: T & any) => {
      // 过滤children
      const [filteredChildren, restChildren] = _filterChildren(parent.pid, _children);
      // 给panrent添加children属性
      filteredChildren && filteredChildren.length && (parent.children = filteredChildren);
      // 重新复制_children数组，减少轮询次数
      _children = restChildren;
    });

    return [_parents, index - 1];
  };

  /**
   * @description: 根据parentId过滤的children数组
   * @param {Number} parentPid 父级pid
   * @param {Array} children 子级数组
   * @return {Object} { filteredChildren <->符合条件的数组, restChildren <->剩余数组，降低数组便利复杂度 }
   */
  const _filterChildren: Function = <T>(parentPid: number, children: T[]) => {
    const _filteredChildren = children.filter((child: T & any) => child.parentPid === parentPid);
    const _restChildren = children.filter((child: T & any) => child.parentPid !== parentPid);
    return [_filteredChildren, _restChildren];
  };

  for (let i = _startIndex; i > 0; i--) {
    if (_startIndex === 0) return;
    const [newTree, startIndex] = _genChildren(arrs[_startIndex - 1], _tree, _startIndex);
    _tree = newTree;
    _startIndex = startIndex;
  }

  return _tree;
}

/**
 * @description: 对象数组排序
 * @param {Array} list 需要判断的字符串
 * @return {Array} list 返回排序后的数组
 */
export function objectArraySort<T>(list: T[], key = 'index'): T[] {
  if (Object.prototype.toString.call(list) !== '[object Array]') return list;
  if (list && !list.length) return list;
  if (list.length === 1) return list;
  type ItemType = T & any;
  return list.sort((prev: ItemType, next: ItemType) => prev[key].localeCompare(next[key]));
}

/**
 * @description: 判断一个字符串是否是一个json字符串
 * @param {String} str 需要判断的字符串
 * @return {Boolean} true | false
 */
export function isJsonString(str: string) {
  if (typeof str !== 'string') return;
  try {
    const _obj = JSON.parse(str);
    return _obj && typeof _obj === 'object';
  } catch (err) {
    console.log(`error: ${str} ! ${err}`);
  }
}

/**
 * @description: 获取map中指定的key的value
 * @param {Map} map 目标map
 * @param {String} key 指定的key
 * @return {Object or Array} 返回对应的value
 */
export function getValueByKey<K, V>(map: Map<K, V>, key: K): V | undefined {
  return map.get(key);
}

/**
 * @description: 将一个对象数组按照某一个key生成一个Map对象，无索引
 * @param {Array} list 需要转换的数组
 * @param {any} key 数组中某个对象的属性
 * @param {Object} keyModel 属性映射表，解决对象字段重命名(默认是增加属性,配合isDelOldKey), 如 {"a": "b"},也就是要将数据源中对象的属性 a 替换成 属性b，值保持不变
 * @param {Boolean} isDelOldKey 是否要删除旧的属性，也就是否要删除 a
 * @return {Map} _map 返回处理过后的map对象
 */
export function genMapFromArrayByKey<K, V>(
  map: Map<K, V>,
  list: any[],
  key: K,
  keyModel: Object & any,
  isDelOldKey: boolean
): Map<K, V> | undefined {
  // 非数组直接返回
  if (Object.prototype.toString.call(list) !== '[object Array]') return;

  // 空数组直接返回
  if (!list?.length) return;

  for (let i = 0, len = list.length; i < len; i++) {
    const _item = { ...list[i] }; // 拷贝

    if (keyModel) {
      for (const k in keyModel) {
        _item[keyModel[k]] = _item[k];
      }
    }

    if (!isDelOldKey) {
      map.set(_item[key], _item);
    } else {
      map.set(_item[keyModel[key]], _item);
    }
  }

  return map;
}

/**
 * @description: 将一个对象数组按照某一个key生成一个Object对象
 * @param {Array} list 需要转换的数组
 * @param {any} key 数组中某个对象的属性
 * @param {Object} keyModel 属性映射表，解决对象字段重命名(默认是增加属性,配合isDelOldKey), 如 {"a": "b"},也就是要将数据源中对象的属性 a 替换成 属性b，值保持不变
 * @param {Boolean} isDelOldKey 是否要删除旧的属性，也就是否要删除 a
 * @return {Object} obj 返回处理过后的Object对象
 */
export function genObjFromArrayByKey<T>(
  obj: Object & any,
  list: any[],
  key: T,
  keyModel: any,
  isDelOldKey: boolean
): Object | undefined {
  // 非数组直接返回
  if (Object.prototype.toString.call(list) !== '[object Array]') return obj;

  // 空数组直接返回
  if (!list?.length) return;

  if (!obj) obj = {};

  for (let i = 0, len = list.length; i < len; i++) {
    const _item = { ...list[i] }; // 拷贝

    if (keyModel) {
      for (const k in keyModel) {
        _item[keyModel[k]] = _item[k];
      }
    }

    if (!isDelOldKey) {
      obj[_item[key]] = _item;
    } else {
      obj[keyModel[key]] = _item;
    }
  }

  return obj;
}

export function throttle(fn: Function, delay: number): Function {
  let valid = true;
  return function () {
    if (!valid) {
      return false;
    }
    valid = false;
    setTimeout(() => {
      fn();
      valid = true;
    }, delay);
  };
}

export function dedounce(fn: Function, delay: number): Function {
  let time: any = null;
  return function () {
    if (time) {
      clearTimeout(time);
    }
    time = setTimeout(() => fn(), delay);
  };
}

export function millisecond2second(millisecond: number) {
  return Number((millisecond + '').substring(0, 10)) * 1000;
}

export function filterRequestInvalidAttr(obj: any) {
  if (getType(obj) !== '[object Object]') {
    throw new Error(`${obj}'s type should be an Object.`);
  }

  for (const key in obj) {
    if ([null, undefined].includes(obj[key])) {
      delete obj[key];
    }
  }
  return obj;
}

export function sleep<T>(time = 0): Promise<T> {
  return new Promise((resolve: Function) => setTimeout(() => resolve(), time));
}

/**
 * 获取数据的类型
 * @param {any} data 数据变量
 * @return 返回改变量的数据类型
 */
export function getType<T>(data: T) {
  return Object.prototype.toString.call(data);
}

/**
 * 通过选择获取dom的样式，或者某一个样式属性的值
 * @param {string} selector 选择器
 * @param {stirng} property 样式属性
 * @return 样式集合|样式的值
 */
export function getStyle(selector: any, property?: string): string | undefined {
  if (!selector) return;
  const _style: any = getComputedStyle(document.querySelector(selector));
  return property ? _style[property] : _style;
}

/**
 * 生成指定的随机数
 * @param {*} len
 * @param {*} radix
 * @returns
 */
export function uuid(len: number, radix: number): string {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
  const uuid = [];
  let i;
  radix = radix || chars.length;

  if (len) {
    for (i = 0; i < len; i++) uuid[i] = chars[0 | (Math.random() * radix)];
  } else {
    var r;

    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
    uuid[14] = '4';

    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | (Math.random() * 16);
        uuid[i] = chars[i === 19 ? (r & 0x3) | 0x8 : r];
      }
    }
  }

  return uuid.join('');
}

/**
 * format account
 * @param {string} address metaMask's account
 */
export function formatAddress(address = ''): string {
  if (!address) {
    return 'no account';
  }

  const [, start, end] = address.match(/(0x[0-9a-zA-Z]{3})[0-9a-zA-Z]+([0-9a-zA-Z]{4})/)!;
  console.log(start, end);
  return `${start}...${end}`;
}

/**
 * get formated balance
 * @param {number} balance account‘s balance
 * @returns formated balance
 */
export function formatBalance(balance: number): number {
  if (!balance) return 0;

  const [, integers, decimals] = (balance + '').match(/^([0-9]+)(?:(\.[0-9]{4})\d+)?$/)!;
  return Number(`${integers}${decimals || ''}`);
}
