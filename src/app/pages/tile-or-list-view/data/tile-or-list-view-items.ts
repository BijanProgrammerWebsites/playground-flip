interface Item {
    image: string;
    name: string;
    category: string;
    color: string;
    count: number;
}

export const TILE_OR_LIST_VIEW_ITEMS: Item[] = [
    {
        image: 'assets/images/minimal/leaves.jpg',
        name: 'Leaves',
        category: 'Nature',
        color: '#94a433',
        count: 5,
    },
    {
        image: 'assets/images/minimal/eggs.jpg',
        name: 'Eggshells',
        category: 'Food',
        color: '#fade56',
        count: 16,
    },
    {
        image: 'assets/images/minimal/tv.jpg',
        name: 'Television',
        category: 'Object',
        color: '#b57454',
        count: 1,
    },
    {
        image: 'assets/images/minimal/window-01.jpg',
        name: 'Window',
        category: 'Structure',
        color: '#fde2c5',
        count: 1,
    },
    {
        image: 'assets/images/minimal/heart.jpg',
        name: 'Heart',
        category: 'Object',
        color: '#ebc5ce',
        count: 1,
    },
    {
        image: 'assets/images/minimal/pencils.jpg',
        name: 'Stationery',
        category: 'Stationery',
        color: '#d4b701',
        count: 7,
    },
    {
        image: 'assets/images/minimal/egg.jpg',
        name: 'Egg',
        category: 'Food',
        color: '#da0e25',
        count: 1,
    },
    {
        image: 'assets/images/minimal/wheat.jpg',
        name: 'Wheat',
        category: 'Nature',
        color: '#78adbb',
        count: 2,
    },
];
