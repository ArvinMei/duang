def((ListItem, Confirm) => class extends ListItem {
  init() {
    this.text = this.title || this.method;
    if (!this.checkPermissions()) this.element.style.display = 'none';
  }

  checkPermissions() {
    return this.checkRequire() && this.checkRequireField();
  }

  checkRequire() {
    if (!this.require) return true;
    let requireList = [].concat(this.require);
    if (requireList.length === 0) return true;
    let { session } = this.depot;
    let { permissions } = session;
    return requireList.some(code => permissions.includes(code));
  }

  checkRequireField() {
    if (!this.requireField) return true;
    let requireFieldList = [].concat(this.requireField);
    if (requireFieldList.length === 0) return true;
    return requireFieldList.some(fieldName => this.fieldMap[fieldName]);
  }

  onClick() {
    this.confirm ? Confirm.popup(this.confirm, this.depot).then(result => result && this.exec()) : this.exec();
  }
  get exec() { return this[this.method + 'Action'] || this.defaultAction; }

  goAction() {
    let { module, key, params, _blank, target, title, where, depot } = this;
    params = refactor(params || {}, this.fieldMap);
    where = refactor(where || {}, this.fieldMap);
    if (_blank) target = '_blank';
    return depot.go({ args: { module, key, params, where }, target, title });
  }

  editAction() {
    let { depot } = this;
    this.module = 'editor';
    this.params = Object.assign({ '@id': '$.id' }, depot.params);
    this.key = depot.key;
    this.goAction();
  }
  defaultAction() {
    let { depot } = this;
    let path = [ depot.resolvedKey, this.fieldMap.id ];
    if ('api' in this) path.push(this.api);
    api(path, { method: this.method || 'POST' }).then(() => {
      depot.refresh();
    }, error => {
      alert(error.message);
    });
  }
  get styleSheet() {
    return `
      :scope {
        margin-right: .5em;
        display: inline-block;
        color: #20A0FF;
        font-size: 12px;
        &:hover {
          color: #1D8CE0;
        }
      }
    `;
  }
});
