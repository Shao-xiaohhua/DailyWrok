
export class EntityCombo {
  id: string;
  text: string;
  pinyin: string;
  children: Array<EntityCombo>;
  data: any;
  disabled: boolean;
  constructor(data: {}, id: string, text: string, children: string) {
    this.id = data[id];
    this.text = data[text];
    this.data = data;
    if (data[children] != null && data[children].length > 0) {
      this.disabled = true;
      this.children = new Array<EntityCombo>();
      data[children].forEach(childData => {
        this.children.push(new EntityCombo(childData, id, text, children));
      });
    }
  }
}

export class EnumField {
  id: string;
  text: string;
  disabled = false;
  children: Array<EnumField>;
  data: any;
  constructor(data: {}, id: string, text: string, children: string) {
    this.id = data[id];
    this.text = data[text];
    this.data = data;
    if (data[children] != null) {
      this.children = new Array<EnumField>();
      data[children].forEach(childData => {
        this.children.push(new EnumField(childData, id, text, children));
      });
    }
  }
}

export class OptionCombo {
  id: string;
  text: string;
  children: Array<OptionCombo>;
  data: any;
  disabled: boolean;
  constructor(data: {}, id: string, text: string, children: string) {
    this.id = data[id];
    this.text = data[text];
    this.data = data;
    const MODE = 'mode';
    // tslint:disable-next-line: no-use-before-declare
    if (data[MODE] !== CategoryMode.Element) {
      this.disabled = true;
    }
    const CODE = 'code';
    if (data[CODE]) {
      const code = data[CODE];
      if (code && code.length > 0) {
        this.text = '（' + code + '）' + this.text;
      }
    }
    if (data[children] != null) {
      this.children = new Array<OptionCombo>();
      data[children].forEach(childData => {
        if (!childData.disabled) {
          this.children.push(new OptionCombo(childData, id, text, children));
        }
      });
    }
  }
}

export enum CategoryMode {
  Group,
  Set,
  Element,
}
