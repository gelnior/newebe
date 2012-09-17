# -*- coding: utf-8 -*-


stoplists = {
    "en": frozenset("""
    i me my myself we our ours ourselves you your yours yourself yourselves
    he him his himself she her hers herself it its itself they them their
    theirs themselves what which who whom this that these those am is are
    was were be been being have has had having do does did doing a an the
    and but if or because as until while of at by for with about against
    between into through during before after above below to from up down in
    out on off over under again further then once here there when where why
    how all any both each few more most other some such no nor not only own
    same so than too very s t can will just don should now
    """.split()),

    "fr": frozenset("""
    au aux avec ce ces dans de des du elle en et eux il je la le leur lui ma
    mais me même mes moi mon ne nos notre nous on ou par pas pour qu que
    qui sa se ses son sur ta te tes toi ton tu un une vos votre vous c d j l
    à m n s t y été étée étées étés étant étante étants étantes
    suis es est sommes êtes sont serai seras sera serons serez seront
    serais serait serions seriez seraient étais était étions étiez
    étaient fus fut fûmes fûtes furent sois soit soyons soyez soient
    fusse fusses fût fussions fussiez fussent ayant ayante ayantes ayants
    eu eue eues eus ai as avons avez ont aurai auras aura aurons aurez
    auront aurais aurait aurions auriez auraient avais avait avions aviez
    avaient eut eûmes eûtes eurent aie aies ait ayons ayez aient eusse
    eusses eût eussions eussiez eussent
    """.split()),
}
