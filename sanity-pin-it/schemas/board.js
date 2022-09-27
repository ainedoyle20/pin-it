export default {
  name: 'board',
  title: 'Board',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
    },
    {
      name: 'userId',
      title: 'UserId',
      type: 'string',
    },
    {
      name: 'postedBy',
      title: 'postedBy',
      type: 'postedBy',
    },
    {
      name: 'savedPins',
      title: 'Saved Pins',
      type: 'array',
      of: [{ type: 'savedPin' }],
    },
  ]
}