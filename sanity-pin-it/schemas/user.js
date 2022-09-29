export default {
  name: 'user',
  title: 'User',
  type: 'document',
  fields: [
    {
        name: 'userName',
        title: 'UserName',
        type: 'string',
    },
    {
        name: 'image',
        title: 'Image',
        type: 'image',
        options: {
          hotspot: true,
        },
    },
    {
        name: 'website',
        title: 'Website',
        placeholder: 'Add a link to your personal website',
        type: 'string',
    },
    {
      name: 'tuneFeed',
      title: 'TuneFeed',
      type: 'array',
      of: [{ type: 'tuneFeed' }],
    }
  ],
}