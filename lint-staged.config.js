export default {
  '*.js': ['eslint --fix', 'prettier --write'],
  '*.ts': ['eslint --fix', 'prettier --write'],
  '*.json': ['prettier --write'],
  '!**/dist/**/*': [],
  '!**/node_modules/**/*': [],
};
