export const structure = (S) =>
  S.list()
    .title('Bolt Services')
    .items([
      S.listItem()
        .title('Site Settings')
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
            .title('Site Settings')
        ),
      S.divider(),
      S.documentTypeListItem('service').title('Services'),
      S.documentTypeListItem('teamMember').title('Team Members'),
      S.documentTypeListItem('testimonial').title('Testimonials'),
      S.documentTypeListItem('insurance').title('Insurances'),
      S.documentTypeListItem('partnership').title('Partnerships'),
      S.documentTypeListItem('blogPost').title('Blog Posts'),
    ])
