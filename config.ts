
const templateConfig = [{
    name: 'react-mobile',
    gitUrl: 'https://github.com/vvvliqian917/vite',
}, {
    name: 'react-qiankun',
    gitUrl: 'https://github.com/vvvliqian917/tracking.git',
}] as const;

export const templateConfigMap = templateConfig.reduce((acc, cur) => {
    acc[cur.name] = cur;
    return acc;
}, {} as Record<TTemplateType, TConfig[number]>);
export type TConfig = typeof templateConfig;
export type TTemplateType = TConfig[number]['name'];
