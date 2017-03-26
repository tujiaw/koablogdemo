function onTagClick(self) {
    const unSelectClass = "glyphicon-star-empty";
    const selectClass = "glyphicon-star";

    const spanObj = $(self).find('span');
    let isAdd = ($(self).html().indexOf(unSelectClass) >= 0);
    spanObj.removeClass(unSelectClass);
    spanObj.removeClass(selectClass);
    spanObj.addClass(isAdd ? selectClass : unSelectClass);

    const tagname = $(self).text().trim();
    let tags = $('#tags').val().split(';');
    if (isAdd) {
        tags.push(tagname);
    } else {
        for (let i = 0; i < tags.length; i++) {
            if (tags[i] == tagname) {
                tags.splice(i, 1);
                break;
            }
        }
    }
    $('#tags').val(tags.join(';'));
    console.log($('#tags').val());
}