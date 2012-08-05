function(doc) {
  if("Contact" == doc.doc_type && "Trusted" == doc.state) {
    doc.tags.forEach(function(tag) {
      emit(tag, doc);
    });
  }
}
