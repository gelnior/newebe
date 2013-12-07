function(doc) {
  if("ContactTag" == doc.doc_type) {
      emit(doc._id, doc);
  }
}
