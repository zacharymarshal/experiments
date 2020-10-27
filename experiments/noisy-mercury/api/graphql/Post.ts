import { objectType, extendType } from '@nexus/schema'

export const Post = objectType({
  name: 'Post',
  definition(t) {
    t.int('id');
    t.string('title');
    t.string('body');
    t.boolean('published');
  }
});

export const PostQuery = extendType({
  type: 'Query',
  definition(t) {
    t.list.field('drafts', {
      nullable: false,
      type: 'Post',
      resolve() {
        return [{id: 1, title: 'Woot', body: '...', published: false}];
      }
    });
  }
});
