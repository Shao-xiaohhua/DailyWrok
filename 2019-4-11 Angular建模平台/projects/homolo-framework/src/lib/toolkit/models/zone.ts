
export class Zone {
    id: string;
    name: string;
    code: string;
    remark: string;
    isLeaf: boolean;
    children: Array<Zone>;

    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.code = data.code;
        this.remark = data.remark;
        this.isLeaf = data.leaf;
        this.children = new Array<Zone>();
        if (data.children) {
            data.children.forEach(childData => {
                const childZone = new Zone(childData);
                this.children.push(childZone);
            });
        }
    }
}
