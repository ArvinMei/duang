const doAction = (data, depot = window.depot) => {
  let { action, args } = data || {};
  args = refactor(args, depot);
  switch (action) {
    case 'confirm': return req('Confirm').then(Confirm => Confirm.popup(args));
    case 'replace': return location.replace(args.href);
    case 'assign': return location.assign(args.href);
    case 'go': return location.replace('#!' + new UParams(args));
    case 'get':
    case 'put':
    case 'delete':
    case 'post':
    case 'patch':
      {
        let body = JSON.stringify(args.body);
        return api([ depot.key, args.key ], { method: action, body }).then(result => doAction(result, depot));
      }
    case 'reject': return Promise.reject(args);
    case 'resolve': return Promise.resolve(args);
  }
  return Promise.resolve(data);
};
