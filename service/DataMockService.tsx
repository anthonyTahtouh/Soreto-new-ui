import type { Demo } from '@/types';

export const DataMockService = {
    getSoretoData() {
        return fetch('/demo/data/soreto-data-light.json', {
            headers: { 'Cache-Control': 'no-cache' }
        })
            .then((res) => res.json())
            .then((d) => d.data as any[]);
    },

    getTreeTableNodes() {
        return fetch('/demo/data/treetablenodes.json', {
            headers: { 'Cache-Control': 'no-cache' }
        })
            .then((res) => res.json())
            .then((d) => d.data as any[]);
    }
};
