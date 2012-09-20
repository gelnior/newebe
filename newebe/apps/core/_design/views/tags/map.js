function(doc) {
  if("Contact" == doc.doc_type) {
    doc.tags.forEach(function(tag) {
      emit(tag, null);
    });
  }
}
