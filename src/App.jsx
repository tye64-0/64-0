import React, { useState, useRef, useEffect } from "react";

// ─── SQUAD DATA ────────────────────────────────────────────────────────────────
const SQUADS_RAW = {
  "England 1966":       { flag:"🏴", yr:1966, p:[["Gordon Banks","GK",89],["George Cohen","RB",77],["Ray Wilson","LB",82],["Jack Charlton","CB",79],["Bobby Moore","CB",90],["Nobby Stiles","CDM",80],["Alan Ball","RM",84],["Bobby Charlton","CM",89],["Martin Peters","LM",82],["Roger Hunt","ST",80],["Geoff Hurst","ST",83]] },
  "West Germany 1966":  { flag:"🇩🇪", yr:1966, p:[["Sepp Maier","GK",87],["Horst-Dieter Höttges","RB",76],["Karl-Heinz Schnellinger","LB",79],["Willi Schulz","CB",77],["Wolfgang Weber","CB",76],["Franz Beckenbauer","CM",93],["Helmut Haller","CAM",80],["Uwe Seeler","CF",85],["Sigfried Held","LW",76],["Lothar Emmerich","LM",77],["Helmut Schäfer","RM",73]] },
  "Portugal 1966":      { flag:"🇵🇹", yr:1966, p:[["José Pereira","GK",77],["João Morais","RB",75],["Alexandre Baptista","LB",74],["Vicente Lucas","CB",75],["Hilário","CB",76],["Jaime Graça","CM",77],["Mário Coluna","CDM",82],["José Augusto","RW",79],["António Simões","LW",78],["Torres","ST",77],["Eusébio","CF",92]] },
  "Soviet Union 1966":  { flag:"🇷🇺", yr:1966, p:[["Lev Yashin","GK",93],["Vladimir Ponomarev","RB",76],["Leonid Ostrovskiy","LB",74],["Albert Shesternev","CB",82],["Vasily Danilov","CB",75],["Igor Sabo","CDM",77],["Valery Voronin","CM",80],["Galimzyan Khusainov","RM",77],["Eduard Malofeyev","LM",76],["Anatoly Banishevsky","ST",77],["Gennady Logofet","RW",75]] },
  "Brazil 1970":        { flag:"🇧🇷", yr:1970, p:[["Félix","GK",76],["Carlos Alberto","RB",87],["Everaldo","LB",77],["Brito","CB",77],["Piazza","CB",76],["Clodoaldo","CDM",80],["Gérson","CM",84],["Rivelino","LM",87],["Jairzinho","RW",88],["Tostão","CF",85],["Pelé","ST",95]] },
  "West Germany 1970":  { flag:"🇩🇪", yr:1970, p:[["Sepp Maier","GK",87],["Berti Vogts","RB",82],["Karl-Heinz Schnellinger","LB",79],["Franz Beckenbauer","CB",93],["Willi Schulz","CB",77],["Wolfgang Overath","CM",83],["Uwe Seeler","CF",85],["Gerd Müller","ST",92],["Jürgen Grabowski","RW",79],["Hannes Löhr","LW",76],["Helmut Haller","CAM",80]] },
  "Italy 1970":         { flag:"🇮🇹", yr:1970, p:[["Enrico Albertosi","GK",79],["Tarcisio Burgnich","RB",82],["Giacinto Facchetti","LB",84],["Roberto Rosato","CB",77],["Pierluigi Cera","CB",77],["Sandro Mazzola","CM",85],["Gianni Rivera","CAM",86],["Angelo Domenghini","RM",77],["Luigi Riva","LW",86],["Gigi Boninsegna","ST",82],["Romeo Benetti","CDM",77]] },
  "Uruguay 1970":       { flag:"🇺🇾", yr:1970, p:[["Ladislao Mazurkiewicz","GK",84],["Atilio Ancheta","RB",76],["Luis Ubiña","LB",75],["Roberto Matosas","CB",77],["Juan Mujica","CB",76],["Pedro Rocha","CM",82],["Luis Cubilla","RW",79],["Ildo Maneiro","ST",77],["Julio Montero Castillo","LW",77],["Victor Espárrago","CF",77],["Julio Cortés","CDM",76]] },
  "West Germany 1974":  { flag:"🇩🇪", yr:1974, p:[["Sepp Maier","GK",87],["Berti Vogts","RB",83],["Paul Breitner","LB",84],["Franz Beckenbauer","CB",93],["Georg Schwarzenbeck","CB",77],["Rainer Bonhof","CDM",82],["Wolfgang Overath","CM",83],["Uli Hoeness","RM",80],["Jürgen Grabowski","RW",80],["Bernd Hölzenbein","LW",77],["Gerd Müller","ST",92]] },
  "Netherlands 1974":   { flag:"🇳🇱", yr:1974, p:[["Jan Jongbloed","GK",78],["Wim Suurbier","RB",79],["Ruud Krol","LB",83],["Wim Rijsbergen","CB",76],["Arie Haan","CDM",80],["Johan Neeskens","CM",87],["Wim van Hanegem","CM",83],["Johnny Rep","RW",82],["Rob Rensenbrink","LW",85],["Johan Cruyff","CF",94],["Josip Šurjak","ST",75]] },
  "Poland 1974":        { flag:"🇵🇱", yr:1974, p:[["Jan Tomaszewski","GK",82],["Władysław Żmuda","RB",77],["Adam Musiał","LB",76],["Jerzy Gorgoń","CB",77],["Antoni Szymanowski","CB",76],["Henryk Kasperczak","CDM",77],["Zygmunt Maszczyk","CM",77],["Grzegorz Lato","RW",83],["Robert Gadocha","LW",82],["Andrzej Szarmach","ST",80],["Kazimierz Deyna","CAM",83]] },
  "Brazil 1974":        { flag:"🇧🇷", yr:1974, p:[["Émerson Leão","GK",79],["Zé Maria","RB",77],["Francisco Marinho","LB",77],["Luís Pereira","CB",78],["Marinho Chagas","CB",76],["Clodoaldo","CDM",80],["Paulo César Caju","CM",82],["Rivelino","LM",87],["Jairzinho","RW",88],["Valdomiro","ST",76],["Mirandinha","CF",75]] },
  "Argentina 1978":     { flag:"🇦🇷", yr:1978, p:[["Ubaldo Fillol","GK",84],["Jorge Olguín","RB",77],["Amílcar Tarantini","LB",76],["Luis Galván","CB",77],["Daniel Killer","CB",76],["Américo Gallego","CDM",77],["Osvaldo Ardiles","CM",83],["Leopoldo Luque","RW",80],["Mario Kempes","CF",88],["Daniel Bertoni","LW",77],["René Houseman","ST",77]] },
  "Netherlands 1978":   { flag:"🇳🇱", yr:1978, p:[["Jan Jongbloed","GK",79],["Wim Suurbier","RB",77],["Ruud Krol","LB",83],["Ernie Brandts","CB",77],["Jan Poortvliet","CB",77],["Wim Jansen","CDM",78],["Johan Neeskens","CM",87],["Johnny Rep","RW",82],["Rob Rensenbrink","LW",85],["Dick Nanninga","ST",76],["Arie Haan","CM",80]] },
  "Brazil 1978":        { flag:"🇧🇷", yr:1978, p:[["Émerson Leão","GK",80],["Nelinho","RB",78],["Francisco Marinho","LB",77],["Oscar","CB",77],["Amaral","CB",77],["Cerezo","CDM",81],["Dirceu","CM",82],["Zico","CAM",91],["Gil","RW",76],["Reinaldo","ST",79],["Roberto Dinamite","CF",78]] },
  "Italy 1978":         { flag:"🇮🇹", yr:1978, p:[["Dino Zoff","GK",88],["Mauro Bellugi","RB",77],["Antonello Cuccureddu","LB",77],["Gaetano Scirea","CB",84],["Claudio Gentile","CB",81],["Romeo Benetti","CDM",78],["Marco Tardelli","CM",83],["Roberto Bettega","RW",82],["Francesco Graziani","LW",79],["Paolo Rossi","ST",88],["Giancarlo Antognoni","CAM",85]] },
  "Italy 1982":         { flag:"🇮🇹", yr:1982, p:[["Dino Zoff","GK",88],["Claudio Gentile","RB",81],["Antonio Cabrini","LB",82],["Gaetano Scirea","CB",84],["Fulvio Collovati","CB",78],["Gabriele Oriali","CDM",77],["Marco Tardelli","CM",83],["Bruno Conti","RM",82],["Giancarlo Antognoni","CAM",85],["Francesco Graziani","LW",78],["Paolo Rossi","ST",88]] },
  "West Germany 1982":  { flag:"🇩🇪", yr:1982, p:[["Harald Schumacher","GK",83],["Manfred Kaltz","RB",79],["Hans-Peter Briegel","LB",80],["Karl-Heinz Förster","CB",79],["Uli Stielike","CB",80],["Wolfgang Dremmler","CDM",77],["Felix Magath","CM",79],["Karl-Heinz Rummenigge","RW",89],["Paul Breitner","CM",84],["Horst Hrubesch","ST",79],["Klaus Fischer","CF",77]] },
  "France 1982":        { flag:"🇫🇷", yr:1982, p:[["Jean-Luc Ettori","GK",77],["Marius Trésor","RB",79],["Maxime Bossis","LB",80],["Christian Lopez","CB",77],["Yvon Le Roux","CB",75],["Jean Tigana","CDM",85],["Alain Giresse","CM",84],["Michel Platini","CAM",91],["Didier Six","RW",77],["Dominique Rocheteau","LW",79],["Bernard Lacombe","ST",77]] },
  "Brazil 1982":        { flag:"🇧🇷", yr:1982, p:[["Peres","GK",79],["Leandro","RB",80],["Junior","LB",83],["Oscar","CB",78],["Luizinho","CB",77],["Cerezo","CDM",81],["Falcão","CM",90],["Zico","CAM",91],["Éder","LW",83],["Serginho","RW",75],["Careca","ST",84]] },
  "Argentina 1986":     { flag:"🇦🇷", yr:1986, p:[["Nery Pumpido","GK",78],["Sergio Batista","RB",77],["Julio Olarticoechea","LB",76],["José Luis Brown","CB",77],["Oscar Ruggeri","CB",81],["Héctor Enrique","CDM",77],["Jorge Burruchaga","CM",82],["Diego Maradona","CAM",95],["Jorge Valdano","LW",83],["Claudio Borghi","RM",75],["Carlos Garré","ST",75]] },
  "West Germany 1986":  { flag:"🇩🇪", yr:1986, p:[["Harald Schumacher","GK",83],["Thomas Berthold","RB",78],["Andreas Brehme","LB",84],["Karl-Heinz Förster","CB",78],["Hans-Peter Briegel","CB",79],["Lothar Matthäus","CM",91],["Felix Magath","CDM",78],["Karl-Heinz Rummenigge","CF",89],["Klaus Allofs","ST",77],["Rudi Völler","LW",85],["Pierre Littbarski","RW",80]] },
  "France 1986":        { flag:"🇫🇷", yr:1986, p:[["Joël Bats","GK",79],["William Ayache","RB",76],["Maxime Bossis","LB",79],["Marius Trésor","CB",78],["Luis Fernandez","CDM",79],["Jean Tigana","CM",84],["Alain Giresse","CM",83],["Michel Platini","CAM",91],["Dominique Rocheteau","RW",78],["Yannick Stopyra","ST",77],["Bruno Bellone","LW",76]] },
  "Mexico 1986":        { flag:"🇲🇽", yr:1986, p:[["Pablo Larios","GK",77],["Félix Cruz","RB",74],["Agustín Manzo","LB",74],["Richard Morales","CB",75],["Fernando Quirarte","CB",76],["Tomás Boy","CDM",77],["Alejandro Negrete","CM",76],["Hugo Sánchez","ST",88],["Carlos Hermosillo","CF",77],["Francisco Cruz","RM",74],["Javier Aguirre","LM",75]] },
  "Spain 1986":         { flag:"🇪🇸", yr:1986, p:[["Andoni Zubizarreta","GK",85],["Tomás","RB",76],["Camacho","LB",80],["Julio Alberto","CB",77],["Maceda","CB",77],["Víctor","CDM",77],["Michel","CM",82],["Martín Vázquez","CAM",79],["Salinas","RW",77],["Butragueño","ST",85],["Míchel","LW",78]] },
  "West Germany 1990":  { flag:"🇩🇪", yr:1990, p:[["Bodo Illgner","GK",82],["Thomas Berthold","RB",78],["Andreas Brehme","LB",84],["Jürgen Kohler","CB",85],["Guido Buchwald","CB",80],["Lothar Matthäus","CDM",91],["Thomas Häßler","CM",80],["Rudi Völler","CF",85],["Karl-Heinz Rummenigge","RW",89],["Pierre Littbarski","LW",79],["Jürgen Klinsmann","ST",86]] },
  "Argentina 1990":     { flag:"🇦🇷", yr:1990, p:[["Sergio Goycochea","GK",82],["Juan Simón","RB",75],["Julio Olarticoechea","LB",77],["Oscar Ruggeri","CB",81],["Néstor Lorenzo","CB",76],["Sergio Batista","CDM",77],["Jorge Burruchaga","CM",82],["Diego Maradona","CAM",95],["Abel Balbo","CF",78],["Claudio Caniggia","ST",85],["Pedro Troglio","LM",75]] },
  "Italy 1990":         { flag:"🇮🇹", yr:1990, p:[["Walter Zenga","GK",85],["Mauro Tassotti","RB",80],["Paolo Maldini","LB",90],["Franco Baresi","CB",91],["Luigi De Agostini","CB",78],["Carlo Ancelotti","CDM",82],["Roberto Donadoni","CM",80],["Gianluca Vialli","CF",85],["Salvatore Schillaci","ST",84],["Roberto Baggio","CAM",91],["Nicola Berti","RM",77]] },
  "England 1990":       { flag:"🏴", yr:1990, p:[["Peter Shilton","GK",87],["Paul Parker","RB",77],["Stuart Pearce","LB",82],["Terry Butcher","CB",80],["Des Walker","CB",81],["David Platt","CM",80],["Paul Gascoigne","CAM",88],["Chris Waddle","RW",84],["Steve McMahon","CDM",77],["Gary Lineker","ST",87],["John Barnes","LW",83]] },
  "Brazil 1994":        { flag:"🇧🇷", yr:1994, p:[["Taffarel","GK",85],["Cafu","RB",88],["Leonardo","LB",83],["Aldair","CB",83],["Marcio Santos","CB",79],["Mazinho","CDM",77],["Mauro Silva","CM",77],["Zinho","CAM",82],["Mazinhão","RM",76],["Bebeto","ST",86],["Romário","CF",91]] },
  "Italy 1994":         { flag:"🇮🇹", yr:1994, p:[["Gianluca Pagliuca","GK",82],["Mauro Tassotti","RB",79],["Paolo Maldini","LB",90],["Franco Baresi","CB",91],["Alessandro Costacurta","CB",85],["Dino Baggio","CDM",79],["Nicola Berti","CM",78],["Roberto Baggio","CAM",91],["Daniele Massaro","RW",77],["Pierluigi Casiraghi","ST",77],["Beppe Signori","LW",80]] },
  "Germany 1994":       { flag:"🇩🇪", yr:1994, p:[["Bodo Illgner","GK",80],["Steffen Freund","RB",77],["Andreas Brehme","LB",84],["Jürgen Kohler","CB",85],["Matthias Sammer","CB",85],["Lothar Matthäus","CDM",91],["Thomas Häßler","CM",79],["Jürgen Klinsmann","ST",86],["Stefan Effenberg","CAM",85],["Karl-Heinz Riedle","CF",79],["Rudi Völler","LW",82]] },
  "Bulgaria 1994":      { flag:"🇧🇬", yr:1994, p:[["Borislav Mikhailov","GK",80],["Petar Hubchev","RB",77],["Trifon Ivanov","LB",77],["Tzanko Tzvetanov","CB",76],["Milen Milev","CB",75],["Yordan Letchkov","CM",80],["Zlatko Yankov","CDM",77],["Krasimir Balakov","CAM",82],["Emil Kostadinov","RW",78],["Nasko Sirakov","LW",77],["Hristo Stoichkov","ST",88]] },
  "Romania 1994":       { flag:"🇷🇴", yr:1994, p:[["Florin Prunea","GK",78],["Dan Petrescu","RB",80],["Miodrag Belodedici","LB",79],["Gheorghe Mihali","CB",77],["Anton Dobos","CB",76],["Gheorghe Popescu","CDM",83],["Ioán Sabău","CM",77],["Dorinel Munteanu","RM",78],["Florin Răducioiu","LW",79],["Ion Vlădoiu","ST",77],["Gheorghe Hagi","CAM",87]] },
  "France 1998":        { flag:"🇫🇷", yr:1998, p:[["Fabien Barthez","GK",85],["Lilian Thuram","RB",85],["Bixente Lizarazu","LB",83],["Marcel Desailly","CB",86],["Laurent Blanc","CB",84],["Didier Deschamps","CDM",83],["Emmanuel Petit","CM",83],["Zinedine Zidane","CAM",94],["Thierry Henry","LW",90],["Youri Djorkaeff","RW",82],["David Trezeguet","ST",84]] },
  "Brazil 1998":        { flag:"🇧🇷", yr:1998, p:[["Taffarel","GK",84],["Cafu","RB",88],["Roberto Carlos","LB",89],["Aldair","CB",82],["Junior Baiano","CB",78],["César Sampaio","CDM",78],["Rivaldo","LW",89],["Leonardo","CM",82],["Denilson","RW",77],["Bebeto","CF",86],["Ronaldo","ST",93]] },
  "Croatia 1998":       { flag:"🇭🇷", yr:1998, p:[["Drazen Ladić","GK",79],["Zvonimir Soldo","RB",77],["Robert Jarni","LB",78],["Igor Štimac","CB",78],["Slaven Bilić","CB",79],["Zvonimir Boban","CDM",85],["Robert Prosinečki","CM",82],["Aljosa Asanovic","CAM",78],["Davor Šuker","ST",86],["Goran Vlaović","CF",77],["Mario Stanić","RW",78]] },
  "Netherlands 1998":   { flag:"🇳🇱", yr:1998, p:[["Edwin van der Sar","GK",86],["Michael Reiziger","RB",82],["Arthur Numan","LB",80],["Jaap Stam","CB",88],["Frank de Boer","CB",85],["Clarence Seedorf","CDM",85],["Ronald de Boer","CM",80],["Marc Overmars","LW",84],["Patrick Kluivert","ST",84],["Dennis Bergkamp","CF",90],["Philip Cocu","RM",79]] },
  "Germany 1998":       { flag:"🇩🇪", yr:1998, p:[["Andreas Köpke","GK",80],["Christian Wörns","RB",78],["Andreas Brehme","LB",84],["Jürgen Kohler","CB",84],["Lothar Matthäus","CB",91],["Dietmar Hamann","CDM",82],["Stefan Effenberg","CM",84],["Oliver Bierhoff","ST",80],["Jürgen Klinsmann","CF",86],["Thomas Häßler","CAM",77],["Andy Möller","RW",80]] },
  "Brazil 2002":        { flag:"🇧🇷", yr:2002, p:[["Marcos","GK",79],["Cafu","RB",88],["Roberto Carlos","LB",89],["Lúcio","CB",85],["Roque Júnior","CB",77],["Gilberto Silva","CDM",83],["Kleberson","CM",77],["Ronaldinho","LW",92],["Rivaldo","CAM",89],["Ronaldo","ST",93],["Edilson","RW",76]] },
  "Germany 2002":       { flag:"🇩🇪", yr:2002, p:[["Oliver Kahn","GK",91],["Carsten Ramelow","RB",77],["Christian Ziege","LB",79],["Christoph Metzelder","CB",79],["Dietmar Hamann","CDM",83],["Michael Ballack","CM",89],["Torsten Frings","LM",79],["Oliver Neuville","RW",77],["Miroslav Klose","ST",85],["Gerald Asamoah","LW",76],["Bernd Schneider","RM",77]] },
  "Turkey 2002":        { flag:"🇹🇷", yr:2002, p:[["Rüştü Reçber","GK",83],["Fatih Akyel","RB",75],["Bülent Korkmaz","LB",77],["Alpay Özalan","CB",78],["Tayfur Havutçu","CB",76],["Emre Belözoğlu","CDM",80],["Yıldıray Baştürk","CM",79],["Hasan Şaş","RW",77],["Arif Erdem","LW",77],["İlhan Mansız","ST",77],["Hakan Şükür","CF",83]] },
  "South Korea 2002":   { flag:"🇰🇷", yr:2002, p:[["Lee Woon-jae","GK",79],["Song Chong-gug","RB",77],["Kim Tae-young","LB",76],["Choi Jin-cheul","CB",77],["Hong Myung-bo","CB",82],["Kim Nam-il","CDM",76],["Park Ji-sung","CM",82],["Lee Young-pyo","LM",77],["Ahn Jung-hwan","RW",77],["Lee Chun-soo","LW",77],["Hwang Sun-hong","ST",77]] },
  "Senegal 2002":       { flag:"🇸🇳", yr:2002, p:[["Tony Sylva","GK",77],["Omar Daf","RB",75],["Lamine Diatta","LB",76],["Aliou Cissé","CB",77],["Ferdinand Coly","CB",76],["Salif Diao","CDM",78],["Papa Bouba Diop","CM",79],["El-Hadji Diouf","RW",80],["Khalilou Fadiga","LW",78],["Henri Camara","ST",77],["Souleymane Camara","CF",76]] },
  "Italy 2006":         { flag:"🇮🇹", yr:2006, p:[["Gianluigi Buffon","GK",92],["Gianluca Zambrotta","RB",83],["Fabio Grosso","LB",79],["Fabio Cannavaro","CB",90],["Alessandro Nesta","CB",89],["Gennaro Gattuso","CDM",84],["Andrea Pirlo","CM",90],["Mauro Camoranesi","RM",80],["Francesco Totti","CAM",87],["Alberto Gilardino","CF",79],["Luca Toni","ST",85]] },
  "France 2006":        { flag:"🇫🇷", yr:2006, p:[["Fabien Barthez","GK",85],["Willy Sagnol","RB",82],["Eric Abidal","LB",80],["William Gallas","CB",82],["Lilian Thuram","CB",85],["Claude Makélélé","CDM",88],["Patrick Vieira","CM",88],["Zinedine Zidane","CAM",94],["Thierry Henry","LW",90],["Frank Ribéry","RW",84],["David Trezeguet","ST",84]] },
  "Germany 2006":       { flag:"🇩🇪", yr:2006, p:[["Jens Lehmann","GK",82],["Philipp Lahm","RB",88],["Christoph Metzelder","CB",80],["Per Mertesacker","CB",82],["Arne Friedrich","LB",78],["Michael Ballack","CM",89],["Torsten Frings","CDM",80],["Tim Borowski","RM",77],["Miroslav Klose","ST",85],["Lukas Podolski","CF",82],["Thomas Müller","LW",87]] },
  "Brazil 2006":        { flag:"🇧🇷", yr:2006, p:[["Dida","GK",84],["Cafu","RB",88],["Roberto Carlos","LB",89],["Juan","CB",79],["Lúcio","CB",85],["Emerson","CDM",79],["Juninho Pernambucano","CM",83],["Ronaldinho","CAM",92],["Kaká","RW",91],["Ronaldo","ST",93],["Adriano","LW",83]] },
  "England 2006":       { flag:"🏴", yr:2006, p:[["Paul Robinson","GK",78],["Gary Neville","RB",82],["Ashley Cole","LB",86],["John Terry","CB",87],["Rio Ferdinand","CB",87],["Steven Gerrard","CM",88],["Frank Lampard","CM",87],["Joe Cole","LW",79],["Michael Owen","CF",83],["Wayne Rooney","ST",86],["David Beckham","RW",84]] },
  "Portugal 2006":      { flag:"🇵🇹", yr:2006, p:[["Ricardo","GK",79],["Paulo Ferreira","RB",77],["Nuno Valente","LB",77],["Fernando Meira","CB",78],["Ricardo Carvalho","CB",85],["Maniche","CDM",80],["Costinha","CM",77],["Deco","CAM",86],["Cristiano Ronaldo","RW",89],["Luís Figo","LW",88],["Pauleta","ST",80]] },
  "Spain 2010":         { flag:"🇪🇸", yr:2010, p:[["Iker Casillas","GK",88],["Sergio Ramos","RB",86],["Joan Capdevila","LB",77],["Carles Puyol","CB",86],["Gerard Piqué","CB",85],["Sergio Busquets","CDM",87],["Xavi Hernández","CM",92],["Andrés Iniesta","CM",92],["David Silva","CAM",86],["David Villa","ST",88],["Fernando Torres","CF",83]] },
  "Netherlands 2010":   { flag:"🇳🇱", yr:2010, p:[["Maarten Stekelenburg","GK",80],["Gregory van der Wiel","RB",79],["Giovanni van Bronckhorst","LB",82],["Joris Mathijsen","CB",77],["John Heitinga","CB",79],["Mark van Bommel","CDM",83],["Nigel de Jong","CM",82],["Wesley Sneijder","CAM",89],["Arjen Robben","RW",88],["Dirk Kuyt","LW",80],["Robin van Persie","ST",87]] },
  "Germany 2010":       { flag:"🇩🇪", yr:2010, p:[["Manuel Neuer","GK",89],["Philipp Lahm","RB",88],["Jerome Boateng","CB",83],["Mats Hummels","CB",84],["Arne Friedrich","LB",77],["Sami Khedira","CDM",83],["Bastian Schweinsteiger","CM",86],["Thomas Müller","RW",87],["Mesut Özil","CAM",85],["Lukas Podolski","LW",82],["Miroslav Klose","ST",85]] },
  "Uruguay 2010":       { flag:"🇺🇾", yr:2010, p:[["Fernando Muslera","GK",82],["Maxi Pereira","RB",78],["Jorge Fucile","LB",77],["Diego Lugano","CB",79],["Diego Godín","CB",87],["Diego Pérez","CDM",77],["Álvaro Pereira","LM",77],["Egidio Arévalo Ríos","CM",76],["Luis Suárez","ST",87],["Diego Forlán","CF",86],["Edinson Cavani","LW",86]] },
  "Argentina 2010":     { flag:"🇦🇷", yr:2010, p:[["Sergio Romero","GK",79],["Pablo Zabaleta","RB",80],["Clemente Rodríguez","LB",76],["Nicolás Burdisso","CB",78],["Walter Samuel","CB",80],["Javier Mascherano","CDM",87],["Juan Sebastián Verón","CM",80],["Lionel Messi","RW",93],["Carlos Tevez","ST",85],["Gonzalo Higuaín","CF",84],["Sergio Agüero","LW",86]] },
  "Ghana 2010":         { flag:"🇬🇭", yr:2010, p:[["Richard Kingson","GK",76],["Hans Sarpei","RB",75],["John Paintsil","LB",76],["John Mensah","CB",77],["Jonathan Mensah","CB",75],["Anthony Annan","CDM",77],["Michael Essien","CM",85],["Kevin-Prince Boateng","CAM",79],["Asamoah Gyan","ST",82],["André Ayew","LW",78],["Sulley Muntari","RM",78]] },
  "Germany 2014":       { flag:"🇩🇪", yr:2014, p:[["Manuel Neuer","GK",89],["Philipp Lahm","RB",88],["Benedikt Höwedes","LB",79],["Jerome Boateng","CB",85],["Mats Hummels","CB",85],["Bastian Schweinsteiger","CDM",85],["Toni Kroos","CM",90],["Thomas Müller","RW",87],["Mesut Özil","CAM",85],["Mario Götze","LW",83],["Miroslav Klose","ST",85]] },
  "Argentina 2014":     { flag:"🇦🇷", yr:2014, p:[["Sergio Romero","GK",79],["Pablo Zabaleta","RB",80],["Marcos Rojo","LB",79],["Federico Fernández","CB",77],["Martín Demichelis","CB",79],["Javier Mascherano","CDM",88],["Enzo Pérez","CM",77],["Lionel Messi","RW",93],["Ángel Di María","LW",85],["Gonzalo Higuaín","ST",85],["Sergio Agüero","CF",87]] },
  "Brazil 2014":        { flag:"🇧🇷", yr:2014, p:[["Júlio César","GK",80],["Daniel Alves","RB",85],["Marcelo","LB",87],["David Luiz","CB",82],["Thiago Silva","CB",88],["Fernandinho","CDM",83],["Oscar","CM",82],["Hulk","RW",79],["Bernard","LW",77],["Fred","ST",75],["Neymar","CAM",89]] },
  "France 2014":        { flag:"🇫🇷", yr:2014, p:[["Hugo Lloris","GK",86],["Mathieu Debuchy","RB",79],["Patrice Evra","LB",80],["Laurent Koscielny","CB",82],["Raphaël Varane","CB",87],["Blaise Matuidi","CDM",82],["Paul Pogba","CM",86],["Antoine Griezmann","LW",88],["Yohan Cabaye","CM",79],["Olivier Giroud","ST",79],["Karim Benzema","CF",85]] },
  "Colombia 2014":      { flag:"🇨🇴", yr:2014, p:[["David Ospina","GK",79],["Santiago Arias","RB",77],["Pablo Armero","LB",77],["Mario Yepes","CB",77],["Cristián Zapata","CB",77],["Abel Aguilar","CDM",77],["Carlos Sánchez","CM",77],["Juan Cuadrado","RW",82],["James Rodríguez","CAM",85],["Teófilo Gutiérrez","ST",76],["Falcao","CF",87]] },
  "Belgium 2014":       { flag:"🇧🇪", yr:2014, p:[["Thibaut Courtois","GK",89],["Toby Alderweireld","RB",81],["Jan Vertonghen","LB",84],["Vincent Kompany","CB",87],["Thomas Vermaelen","CB",79],["Axel Witsel","CDM",81],["Marouane Fellaini","CM",79],["Eden Hazard","LW",89],["Kevin De Bruyne","CAM",90],["Romelu Lukaku","ST",86],["Dries Mertens","RW",79]] },
  "France 2018":        { flag:"🇫🇷", yr:2018, p:[["Hugo Lloris","GK",87],["Benjamin Pavard","RB",81],["Lucas Hernández","LB",82],["Raphaël Varane","CB",87],["Samuel Umtiti","CB",82],["N'Golo Kanté","CDM",90],["Blaise Matuidi","CM",80],["Paul Pogba","CM",86],["Kylian Mbappé","RW",93],["Antoine Griezmann","LW",88],["Olivier Giroud","ST",79]] },
  "Croatia 2018":       { flag:"🇭🇷", yr:2018, p:[["Danijel Subašić","GK",82],["Šime Vrsaljko","RB",78],["Ivan Strinić","LB",77],["Dejan Lovren","CB",80],["Domagoj Vida","CB",79],["Marcelo Brozović","CDM",85],["Luka Modrić","CM",91],["Ivan Rakitić","CM",86],["Ivan Perišić","LW",84],["Ante Rebić","RW",79],["Mario Mandžukić","ST",83]] },
  "Belgium 2018":       { flag:"🇧🇪", yr:2018, p:[["Thibaut Courtois","GK",89],["Toby Alderweireld","RB",81],["Jan Vertonghen","LB",84],["Vincent Kompany","CB",87],["Thomas Meunier","RWB",79],["Axel Witsel","CDM",81],["Marouane Fellaini","CM",79],["Eden Hazard","LW",89],["Kevin De Bruyne","CAM",90],["Romelu Lukaku","ST",86],["Dries Mertens","CF",84]] },
  "England 2018":       { flag:"🏴", yr:2018, p:[["Jordan Pickford","GK",82],["Kieran Trippier","RB",83],["Ashley Young","LB",77],["Harry Maguire","CB",79],["John Stones","CB",84],["Jordan Henderson","CDM",80],["Dele Alli","CAM",82],["Jesse Lingard","RM",76],["Raheem Sterling","LW",85],["Marcus Rashford","RW",82],["Harry Kane","ST",90]] },
  "Uruguay 2018":       { flag:"🇺🇾", yr:2018, p:[["Fernando Muslera","GK",82],["Martín Cáceres","RB",77],["Gastón Silva","LB",76],["Diego Godín","CB",87],["José Giménez","CB",82],["Lucas Torreira","CDM",80],["Matías Vecino","CM",78],["Rodrigo Bentancur","CM",79],["Luis Suárez","ST",87],["Edinson Cavani","CF",86],["Diego Laxalt","LM",77]] },
  "Russia 2018":        { flag:"🇷🇺", yr:2018, p:[["Igor Akinfeev","GK",80],["Mario Fernandes","RB",77],["Yuri Zhirkov","LB",77],["Sergei Ignashevich","CB",77],["Ilya Kutepov","CB",75],["Roman Zobnin","CDM",77],["Aleksandr Golovin","CM",78],["Denis Cheryshev","LW",78],["Artem Dzyuba","ST",79],["Fyodor Smolov","CF",77],["Aleksandr Samedov","RW",76]] },
  "Sweden 2018":        { flag:"🇸🇪", yr:2018, p:[["Robin Olsen","GK",77],["Mikael Lustig","RB",77],["Martin Olsson","LB",77],["Andreas Granqvist","CB",79],["Victor Lindelöf","CB",80],["Sebastian Larsson","CDM",77],["Emil Forsberg","CAM",79],["Marcus Berg","RW",76],["Viktor Claesson","LW",76],["Marcus Danielson","CM",75],["Ola Toivonen","ST",76]] },
  "Argentina 2022":     { flag:"🇦🇷", yr:2022, p:[["Emiliano Martínez","GK",88],["Nahuel Molina","RB",82],["Marcos Acuña","LB",79],["Cristian Romero","CB",86],["Lisandro Martínez","CB",85],["Rodrigo De Paul","CDM",84],["Enzo Fernández","CM",85],["Alexis Mac Allister","CM",84],["Ángel Di María","LW",85],["Julián Álvarez","CF",86],["Lionel Messi","RW",93]] },
  "France 2022":        { flag:"🇫🇷", yr:2022, p:[["Hugo Lloris","GK",85],["Jules Koundé","RB",85],["Theo Hernández","LB",85],["Raphaël Varane","CB",87],["Dayot Upamecano","CB",83],["Aurélien Tchouaméni","CDM",85],["Adrien Rabiot","CM",82],["Antoine Griezmann","CAM",88],["Kylian Mbappé","ST",93],["Ousmane Dembélé","RW",85],["Olivier Giroud","CF",80]] },
  "Morocco 2022":       { flag:"🇲🇦", yr:2022, p:[["Yassine Bounou","GK",85],["Achraf Hakimi","RB",88],["Noussair Mazraoui","LB",80],["Romain Saïss","CB",79],["Nayef Aguerd","CB",82],["Sofyan Amrabat","CDM",83],["Azzedine Ounahi","CM",81],["Selim Amallah","CM",77],["Hakim Ziyech","RW",82],["Youssef En-Nesyri","ST",82],["Sofiane Boufal","LW",79]] },
  "Croatia 2022":       { flag:"🇭🇷", yr:2022, p:[["Dominik Livaković","GK",84],["Josip Juranović","RB",78],["Borna Sosa","LB",77],["Joško Gvardiol","CB",85],["Lovro Majer","CM",79],["Marcelo Brozović","CDM",85],["Luka Modrić","CM",91],["Ivan Perišić","LW",84],["Ante Budimir","CF",76],["Bruno Petković","ST",77],["Andrej Kramarić","RW",80]] },
  "England 2022":       { flag:"🏴", yr:2022, p:[["Jordan Pickford","GK",82],["Kieran Trippier","RB",83],["Luke Shaw","LB",81],["Harry Maguire","CB",79],["John Stones","CB",84],["Declan Rice","CDM",87],["Jude Bellingham","CM",89],["Bukayo Saka","RW",87],["Phil Foden","LW",88],["Mason Mount","CAM",80],["Harry Kane","ST",90]] },
  "Brazil 2022":        { flag:"🇧🇷", yr:2022, p:[["Alisson","GK",89],["Danilo","RB",81],["Alex Sandro","LB",79],["Thiago Silva","CB",88],["Marquinhos","CB",86],["Casemiro","CDM",87],["Lucas Paquetá","CM",82],["Raphinha","RW",84],["Vinícius Jr.","LW",90],["Richarlison","CF",82],["Neymar Jr.","CAM",90]] },
  "Portugal 2022":      { flag:"🇵🇹", yr:2022, p:[["Diogo Costa","GK",82],["João Cancelo","RB",85],["Raphaël Guerreiro","LB",80],["Rúben Dias","CB",87],["Pepe","CB",80],["Rúben Neves","CDM",83],["Bruno Fernandes","CM",86],["Bernardo Silva","RW",87],["João Félix","LW",83],["Gonçalo Ramos","ST",81],["Cristiano Ronaldo","CF",89]] },
  "Netherlands 2022":   { flag:"🇳🇱", yr:2022, p:[["Andries Noppert","GK",77],["Denzel Dumfries","RB",83],["Daley Blind","LB",79],["Virgil van Dijk","CB",89],["Matthijs de Ligt","CB",85],["Frenkie de Jong","CDM",86],["Teun Koopmeiners","CM",82],["Davy Klaassen","CM",77],["Steven Bergwijn","RW",78],["Cody Gakpo","LW",84],["Memphis Depay","ST",83]] },
  "USA 2022":           { flag:"🇺🇸", yr:2022, p:[["Matt Turner","GK",76],["DeAndre Yedlin","RB",77],["Antonee Robinson","LB",81],["Tim Ream","CB",76],["Walker Zimmermann","CB",76],["Tyler Adams","CDM",82],["Weston McKennie","CM",81],["Yunus Musah","CM",81],["Christian Pulisic","LW",84],["Gio Reyna","CAM",81],["Josh Sargent","ST",76]] },
  "Spain 2022":         { flag:"🇪🇸", yr:2022, p:[["Unai Simón","GK",82],["César Azpilicueta","RB",80],["José Gayà","LB",79],["Pau Torres","CB",82],["Aymeric Laporte","CB",83],["Rodri","CDM",91],["Pedri","CM",88],["Gavi","CM",87],["Ferran Torres","RW",79],["Dani Olmo","LW",80],["Álvaro Morata","ST",81]] },
  "Germany 2022":       { flag:"🇩🇪", yr:2022, p:[["Manuel Neuer","GK",89],["Benjamin Pavard","RB",81],["David Raum","LB",80],["Antonio Rüdiger","CB",85],["Niklas Süle","CB",82],["Joshua Kimmich","CDM",89],["Leon Goretzka","CM",84],["Jamal Musiala","CAM",88],["Serge Gnabry","RW",82],["Kai Havertz","LW",84],["Thomas Müller","ST",87]] },
  "Japan 2022":         { flag:"🇯🇵", yr:2022, p:[["Shuichi Gonda","GK",77],["Hiroki Sakai","RB",77],["Yuto Nagatomo","LB",77],["Maya Yoshida","CB",77],["Ko Itakura","CB",76],["Wataru Endo","CDM",78],["Takumi Minamino","CM",79],["Ritsu Doan","RW",78],["Daizen Maeda","LW",77],["Daichi Kamada","CAM",78],["Kaoru Mitoma","ST",79]] },
  "South Korea 2022":   { flag:"🇰🇷", yr:2022, p:[["Kim Seung-gyu","GK",77],["Kim Moon-hwan","RB",76],["Kim Jin-su","LB",77],["Kim Young-gwon","CB",77],["Kim Min-jae","CB",86],["Jung Woo-young","CDM",77],["Lee Jae-sung","CM",77],["Hwang In-beom","CM",77],["Son Heung-min","LW",88],["Hwang Hee-chan","RW",78],["Cho Gue-sung","ST",77]] },
  "Switzerland 2022":   { flag:"🇨🇭", yr:2022, p:[["Yann Sommer","GK",85],["Silvan Widmer","RB",77],["Ricardo Rodríguez","LB",79],["Manuel Akanji","CB",83],["Fabian Schär","CB",80],["Granit Xhaka","CDM",83],["Remo Freuler","CM",77],["Xherdan Shaqiri","RW",78],["Haris Seferović","LW",77],["Breel Embolo","CF",77],["Ruben Vargas","ST",76]] },
  "Senegal 2022":       { flag:"🇸🇳", yr:2022, p:[["Édouard Mendy","GK",84],["Bouna Sarr","RB",76],["Saliou Ciss","LB",76],["Kalidou Koulibaly","CB",86],["Abdou Diallo","CB",78],["Cheikhou Kouyaté","CDM",77],["Nampalys Mendy","CM",77],["Ismaïla Sarr","RW",82],["Sadio Mané","LW",88],["Bamba Dieng","ST",76],["Iliman Ndiaye","CAM",77]] },
  "England 2026":       { flag:"🏴", yr:2026, p:[["Jordan Pickford","GK",82],["Trent Alexander-Arnold","RB",87],["Luke Shaw","LB",81],["John Stones","CB",84],["Marc Guehi","CB",82],["Declan Rice","CDM",87],["Jude Bellingham","CM",89],["Bukayo Saka","RW",87],["Phil Foden","LW",88],["Cole Palmer","CAM",86],["Harry Kane","ST",90]] },
  "Spain 2026":         { flag:"🇪🇸", yr:2026, p:[["David Raya","GK",82],["Pedro Porro","RB",81],["Alejandro Grimaldo","LB",83],["Aymeric Laporte","CB",83],["Robin Le Normand","CB",81],["Rodri","CDM",91],["Pedri","CM",88],["Gavi","CM",87],["Lamine Yamal","RW",88],["Nico Williams","LW",85],["Álvaro Morata","ST",81]] },
  "France 2026":        { flag:"🇫🇷", yr:2026, p:[["Mike Maignan","GK",86],["Jules Koundé","RB",85],["Theo Hernández","LB",85],["William Saliba","CB",86],["Ibrahima Konaté","CB",84],["N'Golo Kanté","CDM",90],["Aurélien Tchouaméni","CM",85],["Antoine Griezmann","CAM",88],["Kylian Mbappé","ST",93],["Ousmane Dembélé","RW",85],["Marcus Thuram","CF",84]] },
  "Germany 2026":       { flag:"🇩🇪", yr:2026, p:[["Manuel Neuer","GK",89],["Joshua Kimmich","RB",89],["David Raum","LB",80],["Antonio Rüdiger","CB",85],["Jonathan Tah","CB",82],["Robert Andrich","CDM",81],["Florian Wirtz","CAM",88],["Jamal Musiala","CM",88],["Serge Gnabry","RW",82],["Leroy Sané","LW",85],["Kai Havertz","ST",84]] },
  "Brazil 2026":        { flag:"🇧🇷", yr:2026, p:[["Alisson","GK",89],["Danilo","RB",81],["Guilherme Arana","LB",79],["Marquinhos","CB",86],["Gabriel Magalhães","CB",84],["Casemiro","CDM",87],["Bruno Guimarães","CM",85],["Rodrygo","RW",85],["Vinícius Jr.","LW",90],["Endrick","CF",82],["Raphinha","CAM",84]] },
  "Argentina 2026":     { flag:"🇦🇷", yr:2026, p:[["Emiliano Martínez","GK",88],["Nahuel Molina","RB",82],["Nicolás Tagliafico","LB",80],["Cristian Romero","CB",86],["Lisandro Martínez","CB",85],["Rodrigo De Paul","CDM",84],["Enzo Fernández","CM",85],["Alexis Mac Allister","CM",84],["Lionel Messi","RW",93],["Lautaro Martínez","ST",87],["Julián Álvarez","CF",86]] },
  "Portugal 2026":      { flag:"🇵🇹", yr:2026, p:[["Diogo Costa","GK",82],["João Cancelo","RB",85],["Nuno Mendes","LB",84],["Rúben Dias","CB",87],["Gonçalo Inácio","CB",82],["Vitinha","CDM",83],["Bruno Fernandes","CM",86],["Bernardo Silva","CAM",87],["Pedro Neto","RW",83],["Rafael Leão","LW",85],["Cristiano Ronaldo","ST",89]] },
  "Netherlands 2026":   { flag:"🇳🇱", yr:2026, p:[["Bart Verbruggen","GK",81],["Denzel Dumfries","RB",83],["Daley Blind","LB",79],["Virgil van Dijk","CB",89],["Matthijs de Ligt","CB",85],["Frenkie de Jong","CDM",86],["Ryan Gravenberch","CM",83],["Xavi Simons","CAM",84],["Cody Gakpo","LW",84],["Donyell Malen","RW",81],["Wout Weghorst","ST",78]] },
  "Italy 2026":         { flag:"🇮🇹", yr:2026, p:[["Gianluigi Donnarumma","GK",89],["Giovanni Di Lorenzo","RB",82],["Federico Dimarco","LB",83],["Alessandro Bastoni","CB",86],["Riccardo Calafiori","CB",84],["Sandro Tonali","CDM",84],["Nicolò Barella","CM",87],["Lorenzo Pellegrini","CAM",80],["Federico Chiesa","RW",82],["Matteo Politano","LW",79],["Gianluca Scamacca","ST",81]] },
  "Belgium 2026":       { flag:"🇧🇪", yr:2026, p:[["Koen Casteels","GK",81],["Thomas Meunier","RB",79],["Leandro Trossard","LB",82],["Toby Alderweireld","CB",81],["Wout Faes","CB",79],["Axel Witsel","CDM",81],["Kevin De Bruyne","CM",90],["Yannick Carrasco","LW",81],["Lois Openda","ST",82],["Jeremy Doku","RW",82],["Johan Bakayoko","CAM",79]] },
  "USA 2026":           { flag:"🇺🇸", yr:2026, p:[["Matt Turner","GK",77],["Sergino Dest","RB",80],["Antonee Robinson","LB",81],["Miles Robinson","CB",77],["Chris Richards","CB",77],["Tyler Adams","CDM",82],["Weston McKennie","CM",81],["Yunus Musah","CM",81],["Christian Pulisic","CAM",84],["Gio Reyna","LW",81],["Folarin Balogun","ST",79]] },
  "Morocco 2026":       { flag:"🇲🇦", yr:2026, p:[["Yassine Bounou","GK",85],["Achraf Hakimi","RB",88],["Adam Masina","LB",78],["Nayef Aguerd","CB",82],["Romain Saïss","CB",79],["Sofyan Amrabat","CDM",83],["Azzedine Ounahi","CM",81],["Hakim Ziyech","RW",82],["Youssef En-Nesyri","ST",82],["Sofiane Boufal","LW",79],["Abde Ezzalzouli","CAM",79]] },
};

const SQUAD_KEYS = Object.keys(SQUADS_RAW);
const SQUADS = {};
SQUAD_KEYS.forEach(k => {
  const s = SQUADS_RAW[k];
  SQUADS[k] = { flag: s.flag, yr: s.yr, players: s.p.map(([name,pos,rat]) => ({name,pos,rat})) };
});

// ─── SQUAD FACTS ─────────────────────────────────────────────────────────────
const SQUAD_FACTS = {
  "England 1966":      "Hosts England won their only World Cup, beating West Germany 4-2 in the final at Wembley. Geoff Hurst's hat-trick remains the only one in a World Cup final.",
  "West Germany 1966": "West Germany reached the final but lost 4-2 to hosts England. Franz Beckenbauer, just 20 years old, was already their standout player.",
  "Portugal 1966":     "Portugal's greatest World Cup. Eusébio finished as top scorer with 9 goals. They were knocked out by England in the semis but claimed a famous third place.",
  "Soviet Union 1966": "The USSR reached the semi-finals, where Lev Yashin — widely considered the greatest goalkeeper of all time — was in inspired form throughout.",
  "Brazil 1970":       "Widely considered the greatest team ever assembled. Brazil won all six games to lift the Jules Rimet Trophy permanently, with Pelé at the peak of his powers.",
  "West Germany 1970": "The semi-final against Italy — the 'Game of the Century' — ended 4-3 to Italy after extra time. West Germany finished third in a tournament of pure drama.",
  "Italy 1970":        "Italy reached the final with a breathtaking semi-final win over West Germany. They lost 4-1 to Brazil in the final but Gianni Rivera was magical throughout.",
  "Uruguay 1970":      "Uruguay finished fourth, beating the Soviet Union in the third-place play-off. Their famous semi-final defeat to Brazil was decided by a stunning Rivelino cross.",
  "West Germany 1974": "Hosts West Germany won the title on home soil, beating the brilliant Dutch 2-1 in the final. Beckenbauer lifted the trophy as captain.",
  "Netherlands 1974":  "Total Football at its peak. Johan Cruyff and his teammates dazzled the world but fell to West Germany in the final, despite taking an early penalty.",
  "Poland 1974":       "Poland's golden generation finished third, with Grzegorz Lato winning the Golden Boot with 7 goals. One of the tournament's great surprise packages.",
  "Brazil 1974":       "A disappointing tournament by Brazil's standards — they finished fourth. Without Pelé, the magic was missing, though Rivelino remained world class.",
  "Argentina 1978":    "Hosts Argentina won their first World Cup. Mario Kempes scored in the final as they beat Netherlands 3-1 after extra time in a controversial but brilliant tournament.",
  "Netherlands 1978":  "Without Cruyff — who controversially refused to attend — the Dutch still reached the final, losing 3-1 to hosts Argentina after extra time.",
  "Brazil 1978":       "Brazil went unbeaten but finished third. Zico dazzled in midfield and many felt they were unlucky not to reach the final in a controversial group-stage format.",
  "Italy 1978":        "Italy finished fourth after losing the third-place play-off to Brazil. Dino Zoff was immaculate in goal throughout and Paolo Rossi showed early promise.",
  "Italy 1982":        "Paolo Rossi came back from a match-fixing ban to score 6 goals including a hat-trick against Brazil. Italy beat West Germany 3-1 in the final.",
  "West Germany 1982": "West Germany reached the final despite the infamous 'Disgrace of Gijón' against Austria. They lost 3-1 to Italy but Rummenigge was brilliant throughout.",
  "France 1982":       "The heart-breaking semi-final loss to West Germany on penalties — the first World Cup shootout — scarred a generation. Platini's squad was magnificent.",
  "Brazil 1982":       "Possibly the best team not to win a World Cup. The Zico-Falcão-Sócrates midfield was breathtaking, but Italy's Rossi destroyed them 3-2 in the group stage.",
  "Argentina 1986":    "The greatest individual World Cup performance in history. Maradona scored the 'Hand of God' and the 'Goal of the Century' in the same game against England.",
  "West Germany 1986": "West Germany reached the final again, losing 3-2 to Argentina. Rummenigge was devastating and Lothar Matthäus announced himself as one of the world's best.",
  "France 1986":       "Platini's France were eliminated in the semi-finals again — this time by West Germany. A genuinely great team that never quite won the biggest prize.",
  "Mexico 1986":       "Hugo Sánchez was the heartbeat of the hosts, who reached the quarter-finals before losing to West Germany on penalties in front of an electric Azteca crowd.",
  "Spain 1986":        "Butragueño scored four goals against Denmark in the last 16 in one of the great individual World Cup performances. Spain lost to Belgium on penalties in the quarters.",
  "West Germany 1990": "Andreas Brehme's penalty in the 85th minute won a dour final against Argentina 1-0. Lothar Matthäus was the tournament's best player.",
  "Argentina 1990":    "Holders Argentina scraped to the final with Goycochea's penalty saves. Maradona was a shadow of 1986 but still magical in moments.",
  "Italy 1990":        "Host nation Italy went out on penalties to Argentina in the semi-final. Schillaci's six goals won him the Golden Boot in a tournament the Azzurri will never forget.",
  "England 1990":      "Gascoigne's tears, Lineker's equaliser — England's best World Cup since 1966. They lost to West Germany on penalties in the semis in one of football's most emotional nights.",
  "Brazil 1994":       "Romário and Bebeto's legendary partnership fired Brazil to a fourth title, the first decided by a penalty shootout. Roberto Baggio hit the bar with the final kick.",
  "Italy 1994":        "Roberto Baggio carried Italy single-handedly to the final with last-minute goals throughout. His missed penalty in the final shootout remains football's most haunting image.",
  "Germany 1994":      "Germany were knocked out by Bulgaria in the quarter-finals — one of the great upsets. Lothar Matthäus played brilliantly at sweeper in his final World Cup.",
  "Bulgaria 1994":     "Bulgaria's finest hour. Stoichkov and Letchkov dumped out holders Germany and reached the semi-finals before losing to Italy. Stoichkov shared the Golden Boot.",
  "Romania 1994":      "Gheorghe Hagi — the 'Maradona of the Carpathians' — inspired Romania to the quarter-finals with stunning performances, before losing to Sweden on penalties.",
  "France 1998":       "Hosts France won their first and only World Cup on home soil. Zidane's two headers in the final destroyed Brazil 3-0. The nation was united in joy.",
  "Brazil 1998":       "Ronaldo's mysterious seizure before the final cast a shadow over their defeat. Brazil lost 3-0 to France, with Ronaldo visibly unwell throughout.",
  "Croatia 1998":      "Croatia's debut World Cup was sensational. Davor Šuker won the Golden Boot with 6 goals and they finished third in an unforgettable tournament.",
  "Netherlands 1998":  "Bergkamp's sublime control and finish in the quarter-final against Argentina is one of football's greatest ever goals. The Dutch went out on penalties to Brazil.",
  "Germany 1998":      "An embarrassing early exit. Germany lost to Croatia in the quarter-finals in one of the biggest shocks of the decade. The golden generation was fading.",
  "Brazil 2002":       "Ronaldo's redemption — four years after his illness in the final, he scored both goals against Germany to win the trophy. The greatest comeback in football history.",
  "Germany 2002":      "Oliver Kahn was virtually unbeatable until the final. Germany reached the final with a squad of relative unknowns, losing 2-0 to a Ronaldo-inspired Brazil.",
  "Turkey 2002":       "Turkey's greatest World Cup. Hakan Şükür scored the fastest goal in tournament history — 11 seconds — in the third-place play-off. They finished third.",
  "South Korea 2002":  "Co-hosts South Korea stunned the world, beating Spain, Italy, and Portugal to reach the semi-finals. Park Ji-sung and Ahn Jung-hwan became national heroes.",
  "Senegal 2002":      "Making their World Cup debut, Senegal knocked out holders France in the group stage. El-Hadji Diouf was electric as they reached the quarter-finals.",
  "Italy 2006":        "Buffon, Cannavaro, Pirlo — Italy won the tournament with an imperious defensive display. Zidane's headbutt in the final was the tournament's defining moment.",
  "France 2006":       "Zidane came out of international retirement and was magnificent, ending with his infamous headbutt on Materazzi. France lost on penalties to Italy in the final.",
  "Germany 2006":      "The summer fairy tale. Hosts Germany reached the semis with a thrilling style of play. Lahm's opening goal against Costa Rica set the tone for a magical tournament.",
  "Brazil 2006":       "Ronaldinho, Kaká, Ronaldo — on paper the best squad in the world. Yet they were knocked out by France in the quarter-finals in one of the bigger disappointments.",
  "England 2006":      "Beckham, Gerrard, Lampard, Rooney — a golden generation that massively underperformed. They lost on penalties to Portugal in the quarters. Rooney was sent off.",
  "Portugal 2006":     "Portugal finished fourth, with a young Ronaldo emerging on the world stage. Figo's final tournament ended without the trophy his career deserved.",
  "Spain 2010":        "Xavi, Iniesta, and Busquets — the tiki-taka revolution. Iniesta's extra-time goal won the final against Netherlands. Spain's first and greatest World Cup.",
  "Netherlands 2010":  "The dark arts and dark horse. Netherlands played brutally in the final but Iniesta broke their hearts. Robben's missed one-on-one will haunt him forever.",
  "Germany 2010":      "The young generation announced themselves — Müller won the Golden Boot, Özil dazzled, Neuer looked unbeatable. They lost to Spain in the semis.",
  "Uruguay 2010":      "Forlán won the Golden Ball and Suárez's deliberate handball against Ghana — saving a goal on the line — remains the most controversial act of the decade.",
  "Argentina 2010":    "Messi was spectacular in group stages but quieter in the knockouts. Argentina were dismantled 4-0 by Germany in the quarter-finals.",
  "Ghana 2010":        "Ghana came agonisingly close to becoming the first African nation to reach a World Cup semi-final before losing on penalties after Suárez's infamous handball.",
  "Germany 2014":      "The 7-1 destruction of hosts Brazil in the semi-final — the 'Mineirazo' — is one of the most astonishing results in football history. Götze won it in extra time.",
  "Argentina 2014":    "Messi carried Argentina to the final but Götze's extra-time goal denied them the title. Di María's knee injury midway through the tournament changed everything.",
  "Brazil 2014":       "The horror show. Without Neymar (injured) and Thiago Silva (suspended), Brazil collapsed 7-1 to Germany in the semi-final. The nation was traumatised.",
  "France 2014":       "Benzema and Griezmann showed promise but France were knocked out by Germany in the quarter-finals. Paul Pogba emerged as a future star.",
  "Colombia 2014":     "James Rodríguez won the Golden Boot with 6 stunning goals including a chest-and-volley against Uruguay that won Goal of the Tournament. A star was born.",
  "Belgium 2014":      "Belgium's golden generation made the quarter-finals on their debut as contenders, losing to Argentina. De Bruyne, Hazard and Lukaku announced themselves.",
  "France 2018":       "An imperious tournament victory. Mbappé became the second teenager after Pelé to score in a World Cup final as France beat Croatia 4-2 in a classic final.",
  "Croatia 2018":      "Croatia's greatest World Cup. Modrić won the Golden Ball as they beat England in the semis before losing an epic 4-2 final to France. The nation was captivated.",
  "Belgium 2018":      "Belgium's best-ever World Cup result — third place. De Bruyne and Hazard were brilliant, and their 3-2 comeback win over Japan was one of the tournament's best games.",
  "England 2018":      "England's best World Cup in 28 years. Gareth Southgate's squad reached the semis, losing to Croatia in extra time. Trippier's free-kick against Colombia was iconic.",
  "Uruguay 2018":      "Cavani scored twice against Portugal to send them through before injury robbed him of the quarter-final against France. Uruguay lost without their best player.",
  "Russia 2018":       "Hosts Russia exceeded all expectations, reaching the quarter-finals after dramatic penalty wins over Spain. Akinfeev's two saves in that shootout were the tournament's highlight.",
  "Sweden 2018":       "Without Zlatan, Sweden were organised and resolute. They beat Switzerland and Mexico before losing to England in the last 8. Emil Forsberg was their standout.",
  "Argentina 2022":    "Messi finally won the World Cup in his last tournament. The final against France — 3-3 after extra time — is arguably the greatest final ever played. Pure theatre.",
  "France 2022":       "Mbappé scored a hat-trick in the final to drag France back from 3-1 down before losing on penalties. His Golden Boot tally of 8 goals was extraordinary.",
  "Morocco 2022":      "The great story of the tournament. Morocco became the first African and Arab nation to reach a World Cup semi-final, beating Spain, Portugal, and Belgium along the way.",
  "Croatia 2022":      "Another semi-final for Modrić and Croatia. They lost to Argentina but beat Brazil on penalties in the quarters in one of the tournament's most dramatic moments.",
  "England 2022":      "England went out to France in the quarters, with Kane's missed penalty proving decisive. Bellingham and Saka were the stars of the next generation.",
  "Brazil 2022":       "Neymar and Brazil started brilliantly before losing to Croatia on penalties in the quarters. Neymar scored a stunning goal in extra time — it wasn't enough.",
  "Portugal 2022":     "Gonçalo Ramos replaced Ronaldo and scored a hat-trick in the last 16. Portugal were superb until losing to Morocco in the quarters — Ronaldo wept on the bench.",
  "Netherlands 2022":  "Van Dijk led a resolute Dutch side to the quarter-finals. They lost to Argentina in a dramatic shootout after Wout Weghorst scored twice to make it 2-2 late on.",
  "USA 2022":          "The USMNT qualified impressively and performed well in the group stage, with Pulisic producing a memorable goal against Iran. They lost to Netherlands in the last 16.",
  "Spain 2022":        "Spain were brilliant in possession but lost to Morocco on penalties in the last 16 — a huge shock. Pedri and Gavi showed they are the future of world football.",
  "Germany 2022":      "A catastrophic group-stage exit. Despite beating Costa Rica 4-2 in their final game, Japan's win over Spain eliminated Germany for the second consecutive tournament.",
  "Japan 2022":        "Japan's finest World Cup. They sensationally beat both Germany and Spain in the group stage before losing to Croatia on penalties. Mitoma's cross for the Spain winner was sensational.",
  "South Korea 2022":  "Son Heung-min, playing through a fractured eye socket with a protective mask, fired South Korea to the last 16. They lost narrowly to Brazil in an electric game.",
  "Switzerland 2022":  "Switzerland knocked out Serbia with a dramatic late Shaqiri winner. They beat Portugal's second-string side to go through before losing to Portugal in the quarters.",
  "Senegal 2022":      "Sadio Mané broke his hand days before the tournament but Senegal still reached the last 16 as AFCON holders. They lost to England in a tight game.",
  "England 2026":      "England head into 2026 as genuine contenders. Bellingham, Kane, Saka and Foden give them arguably their most talented squad since 1966 — the pressure is enormous.",
  "Spain 2026":        "Defending European Champions, Spain arrive as many people's favourites. Lamine Yamal at 18 is already being called generational, and Rodri anchors one of the best midfields on the planet.",
  "France 2026":       "France are the nearly-men of recent World Cups — finalists in 2022, semi-finalists in 2018. With Mbappé in his prime and Griezmann pulling strings, there are no excuses this time.",
  "Germany 2026":      "Germany have something to prove after humiliating group-stage exits in 2018 and 2022. Wirtz and Musiala give them a creative spark that has been missing for years — expect them to go deep.",
  "Brazil 2026":       "Brazil's wait for a sixth title stretches to 24 years. With Vinícius Jr. in devastating form and a new generation emerging, the pressure on this squad at the Maracanã is immense.",
  "Argentina 2026":    "Defending World Champions and the hottest favourites in years. This is almost certainly Messi's last World Cup at 38 — every match could be his final. A nation holds its breath.",
  "Portugal 2026":     "A squad full of world-class talent led by Bruno Fernandes and Bernardo Silva. Ronaldo at 41 is the great unknown — does he still have it? Rúben Dias makes them hard to beat.",
  "Netherlands 2026":  "The Netherlands have quietly built a superb squad. Van Dijk leads a rock-solid defence, Frenkie de Jong controls midfield, and Xavi Simons brings the creativity. Dark horses for the title.",
  "Italy 2026":        "Italy are back after the humiliation of missing 2022 via a play-off defeat. Donnarumma, Bastoni, Barella and Tonali form a formidable spine — the Azzurri have a point to prove.",
  "Belgium 2026":      "The golden generation's last dance. De Bruyne at 34 may never be this close to a World Cup again. Belgium have the quality to go all the way — the question is whether they can finally deliver.",
  "USA 2026":          "Co-hosts USA will play every game in front of enormous home support. Pulisic leads a young, athletic squad that has been quietly improving for years — they could spring the biggest surprise of the tournament.",
  "Morocco 2026":      "After their historic 2022 semi-final run, Morocco arrive with genuine belief. Hakimi is one of the best full-backs on earth and Amrabat the engine in midfield — nobody wants to face them.",
};

// ─── FORMATIONS ───────────────────────────────────────────────────────────────
const FORMATIONS = {
  "4-4-2": [
    {id:"GK",  label:"GK",  full:"Goalkeeper",          group:"GK",  row:6,col:3},
    {id:"RB",  label:"RB",  full:"Right Back",           group:"DEF", row:5,col:5},
    {id:"RCB", label:"CB",  full:"Right Centre-Back",    group:"DEF", row:5,col:4},
    {id:"LCB", label:"CB",  full:"Left Centre-Back",     group:"DEF", row:5,col:2},
    {id:"LB",  label:"LB",  full:"Left Back",            group:"DEF", row:5,col:1},
    {id:"RM",  label:"RM",  full:"Right Midfield",       group:"MID", row:4,col:5},
    {id:"RCM", label:"CM",  full:"Right Centre-Mid",     group:"MID", row:4,col:4},
    {id:"LCM", label:"CM",  full:"Left Centre-Mid",      group:"MID", row:4,col:2},
    {id:"LM",  label:"LM",  full:"Left Midfield",        group:"MID", row:4,col:1},
    {id:"RST", label:"ST",  full:"Right Striker",        group:"FWD", row:2,col:4},
    {id:"LST", label:"ST",  full:"Left Striker",         group:"FWD", row:2,col:2},
  ],
  "4-3-3": [
    {id:"GK",  label:"GK",  full:"Goalkeeper",           group:"GK",  row:6,col:3},
    {id:"RB",  label:"RB",  full:"Right Back",            group:"DEF", row:5,col:5},
    {id:"RCB", label:"CB",  full:"Right Centre-Back",     group:"DEF", row:5,col:4},
    {id:"LCB", label:"CB",  full:"Left Centre-Back",      group:"DEF", row:5,col:2},
    {id:"LB",  label:"LB",  full:"Left Back",             group:"DEF", row:5,col:1},
    {id:"CDM", label:"CDM", full:"Defensive Mid",         group:"MID", row:4,col:3},
    {id:"RCM", label:"CM",  full:"Right Centre-Mid",      group:"MID", row:3,col:4},
    {id:"LCM", label:"CM",  full:"Left Centre-Mid",       group:"MID", row:3,col:2},
    {id:"RW",  label:"RW",  full:"Right Wing",            group:"FWD", row:2,col:5},
    {id:"ST",  label:"ST",  full:"Striker",               group:"FWD", row:2,col:3},
    {id:"LW",  label:"LW",  full:"Left Wing",             group:"FWD", row:2,col:1},
  ],
  "4-2-3-1": [
    {id:"GK",  label:"GK",  full:"Goalkeeper",            group:"GK",  row:6,col:3},
    {id:"RB",  label:"RB",  full:"Right Back",             group:"DEF", row:5,col:5},
    {id:"RCB", label:"CB",  full:"Right Centre-Back",      group:"DEF", row:5,col:4},
    {id:"LCB", label:"CB",  full:"Left Centre-Back",       group:"DEF", row:5,col:2},
    {id:"LB",  label:"LB",  full:"Left Back",              group:"DEF", row:5,col:1},
    {id:"RDM", label:"CDM", full:"Right Defensive Mid",    group:"MID", row:4,col:4},
    {id:"LDM", label:"CDM", full:"Left Defensive Mid",     group:"MID", row:4,col:2},
    {id:"RAM", label:"RAM", full:"Right Attacking Mid",    group:"MID", row:3,col:5},
    {id:"CAM", label:"CAM", full:"Central Attack. Mid",    group:"MID", row:3,col:3},
    {id:"LAM", label:"LAM", full:"Left Attacking Mid",     group:"MID", row:3,col:1},
    {id:"ST",  label:"ST",  full:"Striker",                group:"FWD", row:2,col:3},
  ],
  "3-5-2": [
    {id:"GK",  label:"GK",  full:"Goalkeeper",             group:"GK",  row:6,col:3},
    {id:"RCB", label:"CB",  full:"Right Centre-Back",      group:"DEF", row:5,col:5},
    {id:"CCB", label:"CB",  full:"Centre-Back",            group:"DEF", row:5,col:3},
    {id:"LCB", label:"CB",  full:"Left Centre-Back",       group:"DEF", row:5,col:1},
    {id:"RWB", label:"RWB", full:"Right Wing-Back",        group:"MID", row:4,col:5},
    {id:"RCM", label:"CM",  full:"Right Centre-Mid",       group:"MID", row:4,col:4},
    {id:"CDM", label:"CDM", full:"Central Mid",            group:"MID", row:4,col:3},
    {id:"LCM", label:"CM",  full:"Left Centre-Mid",        group:"MID", row:4,col:2},
    {id:"LWB", label:"LWB", full:"Left Wing-Back",         group:"MID", row:4,col:1},
    {id:"RST", label:"ST",  full:"Right Striker",          group:"FWD", row:2,col:4},
    {id:"LST", label:"ST",  full:"Left Striker",           group:"FWD", row:2,col:2},
  ],
  "5-3-2": [
    {id:"GK",  label:"GK",  full:"Goalkeeper",             group:"GK",  row:6,col:3},
    {id:"RWB", label:"RWB", full:"Right Wing-Back",        group:"DEF", row:5,col:5},
    {id:"RCB", label:"CB",  full:"Right Centre-Back",      group:"DEF", row:5,col:4},
    {id:"CCB", label:"CB",  full:"Centre-Back",            group:"DEF", row:5,col:3},
    {id:"LCB", label:"CB",  full:"Left Centre-Back",       group:"DEF", row:5,col:2},
    {id:"LWB", label:"LWB", full:"Left Wing-Back",         group:"DEF", row:5,col:1},
    {id:"RCM", label:"CM",  full:"Right Centre-Mid",       group:"MID", row:4,col:4},
    {id:"CDM", label:"CDM", full:"Central Mid",            group:"MID", row:4,col:3},
    {id:"LCM", label:"CM",  full:"Left Centre-Mid",        group:"MID", row:4,col:2},
    {id:"RST", label:"ST",  full:"Right Striker",          group:"FWD", row:2,col:4},
    {id:"LST", label:"ST",  full:"Left Striker",           group:"FWD", row:2,col:2},
  ],
};

// ─── POSITION ELIGIBILITY: exact match only ───────────────────────────────────
// A player can only fill a slot whose label exactly matches their position.
// Paolo Maldini (LB) → only the LB slot. Thierry Henry (LW) → only LW slots.
// The one exception: RAM/LAM slots in 4-2-3-1 accept RW/LW/CAM players since
// those are just positional naming variants of the same role.
function canFill(playerPos, slotLabel) {
  if (playerPos === slotLabel) return true;

  // CM can play CM, CDM, or CAM slots (most versatile)
  if (playerPos === "CM" && ["CM","CDM","CAM","RCM","LCM","RDM","LDM","RAM","LAM"].includes(slotLabel)) return true;
  // CDM can play CM slots but NOT CAM
  if (playerPos === "CDM" && ["CM","CDM","RCM","LCM","RDM","LDM"].includes(slotLabel)) return true;
  // CAM can play CM slots but NOT CDM
  if (playerPos === "CAM" && ["CM","CAM","RCM","LCM","RAM","LAM"].includes(slotLabel)) return true;

  // Left flank: LM and LW are interchangeable
  if (["LM","LW"].includes(playerPos) && ["LM","LW","LAM"].includes(slotLabel)) return true;

  // Right flank: RM and RW are interchangeable
  if (["RM","RW"].includes(playerPos) && ["RM","RW","RAM"].includes(slotLabel)) return true;

  // RST/LST slots: accept ST
  if (["RST","LST"].includes(slotLabel) && playerPos === "ST") return true;
  // CF can play CF, CAM, or ST slots
  if (playerPos === "CF" && ["CF","CAM","ST","RST","LST","RAM","LAM"].includes(slotLabel)) return true;
  // ST slots also accept CF
  if (["ST","RST","LST"].includes(slotLabel) && playerPos === "CF") return true;
  // RCB/LCB/CCB slots: accept CB
  if (["RCB","LCB","CCB"].includes(slotLabel) && playerPos === "CB") return true;

  return false;
}

// ─── SIMULATOR ────────────────────────────────────────────────────────────────
function avgRat(players) { return players.reduce((s,p) => s + p.rat, 0) / players.length; }
function simMatch(myR, oppR) {
  // Realistic World Cup scoring: avg ~2.5-3 goals per game
  // Elite vs weak: ~3.3, even match: ~1.6, 5+ goals: rare (<10%)
  const a = myR + (Math.random()*10-5);
  const b = oppR + (Math.random()*10-5);
  const ga = Math.max(0, Math.round((a-74)/10 + Math.random()*1.6 - 0.4));
  const gb = Math.max(0, Math.round((b-74)/10 + Math.random()*1.6 - 0.4));
  return { ga, gb };
}
// Distribute goals/assists across players for a match
function distributeStats(players, goalsScored, conceded, stats) {
  const fwd = players.filter(p => ["ST","CF","RW","LW","CAM","RAM","LAM","RM","LM","RST","LST"].includes(p.pos));
  const mid = players.filter(p => ["CM","CDM","CAM","RM","LM","RW","LW"].includes(p.pos));
  const def = players.filter(p => ["GK","RB","LB","CB","RWB","LWB","RCB","LCB","CCB"].includes(p.pos));
  const allOut = [...fwd, ...mid].filter((p,i,a)=>a.findIndex(x=>x.name===p.name)===i);

  // Distribute goals — weighted by rating and position (fwd > mid)
  let goalsLeft = goalsScored;
  while (goalsLeft > 0) {
    const pool = allOut.length ? allOut : players;
    const weights = pool.map(p => fwd.includes(p) ? p.rat * 2 : p.rat);
    const total = weights.reduce((a,b)=>a+b,0);
    let r = Math.random() * total;
    for (let i = 0; i < pool.length; i++) {
      r -= weights[i];
      if (r <= 0) {
        stats[pool[i].name] = stats[pool[i].name] || {goals:0,assists:0,cleanSheets:0};
        stats[pool[i].name].goals++;
        break;
      }
    }
    goalsLeft--;
  }

  // Distribute assists — one per goal, from different player than scorer
  for (let g = 0; g < goalsScored; g++) {
    const pool = allOut.length ? allOut : players;
    const p = pool[Math.floor(Math.random() * pool.length)];
    stats[p.name] = stats[p.name] || {goals:0,assists:0,cleanSheets:0};
    stats[p.name].assists++;
  }

  // Clean sheets for defenders+GK if we conceded 0
  if (conceded === 0) {
    def.forEach(p => {
      stats[p.name] = stats[p.name] || {goals:0,assists:0,cleanSheets:0};
      stats[p.name].cleanSheets++;
    });
  }
}

// Generate realistic match minute events for commentary
function generateEvents(myPlayers, ga, gb, oppKey) {
  const events = [];
  const fwd = myPlayers.filter(p => ["ST","CF","RW","LW","CAM","RM","LM","RST","LST"].includes(p.pos));
  const allP = myPlayers.length ? myPlayers : [];
  const scorers = [...fwd, ...allP].filter((p,i,a)=>a.findIndex(x=>x.name===p.name)===i);

  // My goals
  const usedMins = new Set();
  for(let g=0;g<ga;g++){
    let min;
    do { min = 1+Math.floor(Math.random()*93); } while(usedMins.has(min));
    usedMins.add(min);
    const scorer = scorers[Math.floor(Math.random()*scorers.length)] || allP[0];
    events.push({min, type:"goal", name:scorer?.name || "Unknown", own:false});
  }
  // Opp goals
  for(let g=0;g<gb;g++){
    let min;
    do { min = 1+Math.floor(Math.random()*93); } while(usedMins.has(min));
    usedMins.add(min);
    events.push({min, type:"opp_goal", name:oppKey, own:false});
  }
  return events.sort((a,b)=>a.min-b.min);
}

// Sort all squads by their average rating
function getSquadsByTier(sq) {
  const rated = sq.map(k => ({ key:k, flag:SQUADS[k].flag, r:avgRat(SQUADS[k].players) }));
  rated.sort((a,b) => a.r - b.r);
  const n = rated.length;
  // Split into 3 tiers by rating
  return {
    weak:   rated.slice(0, Math.floor(n*0.35)),           // bottom 35% — group stage fodder
    mid:    rated.slice(Math.floor(n*0.35), Math.floor(n*0.70)), // mid 35% — R16/QF
    strong: rated.slice(Math.floor(n*0.70)),               // top 30% — SF/Final
  };
}

function pickRandom(arr, n) {
  return [...arr].sort(()=>Math.random()-.5).slice(0,n);
}

function simulate(myPlayers, availSquads) {
  const sq = availSquads || SQUAD_KEYS;
  const myR = avgRat(myPlayers);
  const tiers = getSquadsByTier(sq);

  // Group stage: draw from weak/mid mix — should be beatable
  const groupOpps = pickRandom([...tiers.weak, ...tiers.mid], 3)
    .map(o => ({key:o.key, flag:o.flag, r:o.r}));

  // Knockout opponents scale up each round:
  // R16: mid tier, QF: mid/strong mix, SF: strong, Final: elite (top 15%)
  const elite = sq.map(k=>({key:k,flag:SQUADS[k].flag,r:avgRat(SQUADS[k].players)}))
    .sort((a,b)=>b.r-a.r).slice(0, Math.max(1, Math.floor(sq.length*0.15)));

  const r16Opp  = pickRandom(tiers.mid, 1)[0] || pickRandom(tiers.weak,1)[0];
  const qfOpp   = pickRandom([...tiers.mid, ...tiers.strong], 1)[0];
  const sfOpp   = pickRandom(tiers.strong, 1)[0];
  const finOpp  = pickRandom(elite.length ? elite : tiers.strong, 1)[0];

  const knockoutOpps = [r16Opp, qfOpp, sfOpp, finOpp].filter(Boolean);

  const playerStats = {};
  const allEvents = {};

  const group = groupOpps.map((opp,i)=>{
    const {ga,gb}=simMatch(myR,opp.r);
    distributeStats(myPlayers, ga, gb, playerStats);
    allEvents[i] = generateEvents(myPlayers, ga, gb, opp.key);
    return {opp,ga,gb,out:ga>gb?"W":ga===gb?"D":"L"};
  });
  const pts = group.reduce((s,g)=>s+(g.out==="W"?3:g.out==="D"?1:0),0);
  if(pts<4){
    const W2=group.filter(m=>m.out==="W").length, D2=group.filter(m=>m.out==="D").length, L2=group.filter(m=>m.out==="L").length;
    return {elim:'Group Stage',group,rounds:[],playerStats,W:W2,D:D2,L:L2,allEvents};
  }

  const stages=["Round of 16","Quarter-Final","Semi-Final","Final"]; const rounds=[];
  for(let i=0;i<4;i++){
    const opp=knockoutOpps[i]; if(!opp) break; const {ga,gb}=simMatch(myR,opp.r);
    let won=ga>gb; let pens=null;
    if(ga===gb){won=Math.random()>.48;pens=won?"Won on penalties":"Lost on penalties";}
    distributeStats(myPlayers, ga, gb, playerStats);
    allEvents[3+i] = generateEvents(myPlayers, ga, gb, opp.key);
    rounds.push({stage:stages[i],opp,ga,gb,pens,won});
    if(!won){
      const allM=[...group,...rounds];
      const Wx=allM.filter(m=>m.out==="W"||m.won===true).length;
      const Dx=allM.filter(m=>m.out==="D").length;
      const Lx=allM.filter(m=>m.out==="L"||m.won===false).length;
      return {elim:stages[i],group,rounds,playerStats,W:Wx,D:Dx,L:Lx,allEvents};
    }
  }
  const allGs = [...group, ...rounds];
  const W = allGs.filter(m=>(m.out||"")+"" === "W" || m.won===true).length;
  const D = allGs.filter(m=>(m.out||"")+"" === "D").length;
  const L = allGs.filter(m=>(m.out||"")+"" === "L" || m.won===false).length;
  return {elim:null,group,rounds,champion:true,playerStats,W,D,L,allEvents};
}

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;900&family=Inter:wght@400;500;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#0A0F1C;
  --surf:#111827;
  --surf2:#1A2436;
  --surf3:#212E44;
  --gold:#C9A227;
  --gold2:#A07C18;
  --gold-hi:#F0C040;
  --gdim:rgba(201,162,39,0.18);
  --gbright:rgba(201,162,39,0.38);
  --txt:#F0F2F8;
  --txt2:#B8BDD0;
  --muted:#8896A8;
  --bdr:rgba(255,255,255,0.09);
  --bdr2:rgba(255,255,255,0.04);
  --grn:#3DD68C;--red:#F26B6B;--yel:#F5B942;
}
html,body,#root{background:#0A0F1C!important;color:var(--txt);font-family:'Inter',sans-serif;min-height:100vh}
.app-root{background:#0A0F1C;min-height:100vh;color:var(--txt)}

/* NAV */
.nav{display:flex;align-items:center;justify-content:space-between;padding:14px 24px;border-bottom:1px solid var(--bdr);background:#0A0F1C;position:sticky;top:0;z-index:50}
.logo{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:1.8rem;color:var(--gold);letter-spacing:4px;line-height:1}
.logo-sub{font-size:.62rem;color:#9BA8BC;letter-spacing:3px;text-transform:uppercase;font-weight:500}
.btn-ghost{background:transparent;border:1px solid var(--gdim);color:var(--gold);padding:6px 14px;border-radius:4px;cursor:pointer;font-size:.75rem;font-family:'Inter',sans-serif;transition:all .15s}
.btn-ghost:hover{background:var(--gdim);border-color:var(--gold)}

/* HERO */
.hero{text-align:center;padding:72px 20px 56px;position:relative;overflow:hidden;background:#0A0F1C}
.hero::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 80% 60% at 50% -10%,rgba(201,162,39,.1),transparent 65%);pointer-events:none}
.hero::after{content:'';position:absolute;bottom:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,var(--gdim),transparent)}
.eye{font-size:.62rem;letter-spacing:4px;text-transform:uppercase;color:var(--gold);margin-bottom:14px;opacity:.8}
.hero-title{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:clamp(5.5rem,18vw,11rem);line-height:.85;color:var(--txt);letter-spacing:-4px}
.hero-title span{color:var(--gold)}
.hero-desc{margin-top:18px;font-size:.95rem;color:var(--txt2);max-width:420px;margin-inline:auto;line-height:1.7}
.btn-primary{background:var(--gold);color:#05080F;font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:1.1rem;letter-spacing:2px;padding:14px 40px;border:none;cursor:pointer;border-radius:4px;transition:all .18s;text-transform:uppercase;margin-top:28px;display:inline-block}
.btn-primary:hover{background:var(--gold-hi);transform:translateY(-1px);box-shadow:0 6px 20px rgba(201,162,39,.25)}
.hero-stats{display:flex;gap:40px;justify-content:center;margin-top:52px;flex-wrap:wrap;padding-top:40px;border-top:1px solid var(--bdr2)}
.hs-n{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:2.4rem;color:var(--gold)}
.hs-l{font-size:.66rem;letter-spacing:2.5px;text-transform:uppercase;color:#9BA8BC;margin-top:4px;font-weight:500}

/* FORMATION PICKER */
.fp{text-align:center;padding:52px 20px 80px;background:#0A0F1C;min-height:100vh}
.fp-title{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:2.2rem;color:var(--txt);margin-bottom:8px}
.fp-sub{color:var(--muted);font-size:.85rem;margin-bottom:36px}
.fp-grid{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}
.fp-card{background:var(--surf);border:1px solid var(--bdr);border-radius:10px;padding:24px 30px;cursor:pointer;transition:all .18s;min-width:118px;text-align:center}
.fp-card:hover{border-color:var(--gold);background:var(--surf2);transform:translateY(-3px);box-shadow:0 8px 24px rgba(0,0,0,.4)}
.fp-label{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:1.8rem;color:var(--txt)}
.fp-sub2{font-size:.58rem;color:var(--muted);margin-top:4px;letter-spacing:2px;text-transform:uppercase}

/* GAME */
.game{max-width:980px;margin:0 auto;padding:28px 16px 80px;background:#0A0F1C;min-height:100vh}
.prog-wrap{height:2px;background:var(--surf3);border-radius:2px;margin-bottom:26px}
.prog-bar{height:2px;background:linear-gradient(90deg,var(--gold),var(--gold-hi));border-radius:2px;transition:width .5s ease}
.cols{display:grid;grid-template-columns:1fr 1fr;gap:20px}
@media(max-width:680px){.cols{grid-template-columns:1fr}}
.sh{font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:.9rem;letter-spacing:3px;text-transform:uppercase;color:var(--gold);margin-bottom:12px;display:flex;align-items:center;gap:10px}
.sh::after{content:'';flex:1;height:1px;background:linear-gradient(90deg,var(--gdim),transparent)}

/* PITCH */
.pitch-wrap{background:var(--surf);border:1px solid var(--bdr);border-radius:10px;overflow:hidden}
.pitch-hdr{padding:10px 14px;border-bottom:1px solid var(--bdr);display:flex;align-items:center;justify-content:space-between;background:var(--surf2)}
.pitch-fm{font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:.85rem;color:var(--gold);letter-spacing:2px}
.pitch-rat{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:1.25rem;color:var(--gold);line-height:1}
.pitch-rl{font-size:.52rem;color:var(--muted);letter-spacing:2px;text-transform:uppercase}
.pitch-wrap{background:var(--surf);border:1px solid var(--bdr);border-radius:10px;overflow:hidden}
.pitch-hdr{padding:10px 14px;border-bottom:1px solid var(--bdr);display:flex;align-items:center;justify-content:space-between;background:var(--surf2)}
.pitch-fm{font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:.85rem;color:var(--gold);letter-spacing:2px}
.pitch-rat{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:1.25rem;color:var(--gold);line-height:1}
.pitch-rl{font-size:.52rem;color:var(--muted);letter-spacing:2px;text-transform:uppercase}
/* SVG pitch container */
.pitch-svg-wrap{width:100%;position:relative;background:#0a1e0a}
.pitch-svg-wrap svg{display:block;width:100%;height:auto}
/* Player badge overlay grid */
.abs-badge{cursor:default}
.ps{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:2px;transition:all .12s;position:relative;z-index:2}
.ps.can{cursor:pointer}
.ps.can:hover .badge{border-color:rgba(201,162,39,.7);background:rgba(201,162,39,.12)}
.ps.glow{animation:gpulse .7s ease-in-out infinite}
@keyframes gpulse{0%,100%{background:rgba(201,162,39,.08)}50%{background:rgba(201,162,39,.2)}}
.badge{width:36px;height:36px;border-radius:50%;border:2px solid rgba(255,255,255,.12);display:flex;align-items:center;justify-content:center;font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:.72rem;letter-spacing:.3px;transition:all .14s;flex-shrink:0;line-height:1}
.badge.e{background:rgba(10,20,10,.7);color:rgba(255,255,255,.35);border-color:rgba(255,255,255,.12)}
.badge.e.can{border-color:rgba(201,162,39,.45);color:rgba(201,162,39,.75);background:rgba(10,20,10,.8)}
.badge.e.glow{border-color:var(--gold);color:var(--gold);background:rgba(201,162,39,.15);box-shadow:0 0 8px rgba(201,162,39,.3)}
.badge.f{background:rgba(201,162,39,.18);color:var(--gold-hi);border-color:var(--gold);box-shadow:0 0 6px rgba(201,162,39,.2)}
.sn{font-size:.44rem;color:rgba(255,255,255,.55);margin-top:2px;text-align:center;max-width:44px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;line-height:1.1;font-weight:500}
.sn.fn{color:rgba(255,255,255,.8);font-size:.44rem;font-weight:600}
.sp{font-size:.38rem;color:var(--gold);font-family:'Barlow Condensed',sans-serif;font-weight:700;opacity:.75;margin-top:1px;line-height:1}

/* ── SLOT MACHINE SPINNER ── */
.spin-panel{background:var(--surf);border:1px solid var(--bdr);border-radius:10px;padding:18px}
.slot-machine{margin:16px auto 0;width:100%;max-width:280px;position:relative}
.slot-window{height:80px;border:1px solid var(--bdr);border-radius:8px;background:var(--surf2);overflow:hidden;position:relative}
.slot-window::before{content:'';position:absolute;top:0;left:0;right:0;height:24px;background:linear-gradient(180deg,var(--surf2) 0%,transparent 100%);z-index:2;pointer-events:none}
.slot-window::after{content:'';position:absolute;bottom:0;left:0;right:0;height:24px;background:linear-gradient(0deg,var(--surf2) 0%,transparent 100%);z-index:2;pointer-events:none}
.slot-item{height:80px;display:flex;align-items:center;justify-content:center;gap:10px;width:100%;flex-shrink:0;padding:0 12px}
.slot-flag{font-size:1.7rem;line-height:1;flex-shrink:0}
.slot-name{font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:.95rem;color:var(--txt);text-align:left;line-height:1.2}
.slot-idle{height:80px;display:flex;align-items:center;justify-content:center;gap:10px}
.slot-idle-icon{font-size:1.8rem;opacity:.18}
.slot-idle-txt{font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:.85rem;color:var(--muted);letter-spacing:3px;text-transform:uppercase}
.spin-btn{display:block;margin:14px 0 0;background:transparent;border:2px solid var(--gold);color:var(--gold);font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:1rem;letter-spacing:2px;padding:10px 0;cursor:pointer;border-radius:4px;transition:all .15s;text-transform:uppercase;width:100%}
.spin-btn:hover:not(:disabled){background:var(--gdim);color:var(--gold-hi)}
.spin-btn:disabled{opacity:.25;cursor:not-allowed}
.reroll-btn{display:flex;align-items:center;justify-content:center;gap:8px;margin:8px 0 0;background:rgba(201,162,39,.08);border:1px solid var(--gbright);color:var(--gold);font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:.95rem;letter-spacing:1px;padding:9px 0;cursor:pointer;border-radius:4px;transition:all .15s;text-transform:uppercase;width:100%}
.reroll-btn:hover:not(:disabled){background:rgba(201,162,39,.16)}
.reroll-btn:disabled{opacity:.3;cursor:not-allowed}
.reroll-pip-row{display:flex;gap:4px;align-items:center}
.reroll-pip{width:8px;height:8px;border-radius:50%;background:rgba(201,162,39,.25);border:1px solid rgba(201,162,39,.4)}
.reroll-pip.on{background:var(--gold);border-color:var(--gold)}
/* DIFFICULTY CARD extra style */
.diff-card{max-width:200px}
.landed-banner{margin-top:12px;padding:12px 14px;background:var(--gdim);border:1px solid var(--gbright);border-radius:6px;display:flex;align-items:flex-start;gap:12px;font-size:.8rem;color:var(--txt2)}
.landed-banner strong{color:var(--gold)}

/* SQUAD LIST */
.sq-hdr{display:flex;align-items:center;gap:8px;margin:14px 0 10px}
.sq-flag{font-size:1.4rem}
.sq-name{font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:1.05rem;color:var(--txt)}
.sq-yr{font-size:.65rem;color:var(--muted)}
.ftabs{display:flex;gap:5px;margin-bottom:10px;flex-wrap:wrap}
.ft{background:transparent;border:1px solid var(--bdr);color:var(--muted);padding:4px 10px;border-radius:4px;cursor:pointer;font-size:.65rem;letter-spacing:.8px;text-transform:uppercase;font-family:'Inter',sans-serif;transition:all .13s}
.ft.act{border-color:var(--gold);color:var(--gold);background:var(--gdim)}
.plist{display:flex;flex-direction:column;gap:5px;max-height:480px;overflow-y:auto;padding-right:2px}
.plist::-webkit-scrollbar{width:3px}
.plist::-webkit-scrollbar-thumb{background:var(--gdim);border-radius:2px}

/* PLAYER ROW */
.pr{background:var(--surf2);border:1px solid var(--bdr);border-radius:6px;overflow:visible;cursor:pointer;transition:border-color .13s}
.pr:hover:not(.used):not(.inel){border-color:rgba(201,162,39,.35)}
.pr.used{opacity:.25;cursor:not-allowed;pointer-events:none}
.pr.inel{opacity:.35;cursor:not-allowed;pointer-events:none}
.pr.sel{border-color:var(--gold);background:var(--surf3)}
.pr-main{padding:9px 11px;display:flex;align-items:center;gap:9px}
.pr-rat{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:1.3rem;color:var(--gold);min-width:32px;line-height:1}
.pr-info{flex:1;min-width:0}
.pr-name{font-size:.83rem;font-weight:600;color:var(--txt);line-height:1.2;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.pr-pos{font-size:.6rem;letter-spacing:1px;color:var(--muted);text-transform:uppercase;margin-top:2px}
.pr-tag{font-size:.58rem;padding:2px 6px;border-radius:3px;white-space:nowrap;flex-shrink:0}
.pr-tag.elig{color:var(--grn);background:rgba(61,214,140,.09);border:1px solid rgba(61,214,140,.15)}
.pr-tag.dim{color:rgba(61,214,140,.3);background:rgba(61,214,140,.04)}
.pr-tag.sel{color:var(--gold);background:var(--gdim);border:1px solid var(--gbright)}

/* INLINE SLOT PICKER */
.slot-picker{border-top:1px solid var(--bdr);background:var(--surf3);border-radius:0 0 6px 6px;padding:12px}
.sp-label{font-size:.6rem;letter-spacing:2px;text-transform:uppercase;color:var(--muted);margin-bottom:8px}
.sp-slots{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}
.sp-slot{background:var(--surf2);border:1px solid var(--bdr);border-radius:6px;padding:10px 8px;cursor:pointer;transition:all .13s;text-align:center}
.sp-slot:hover{border-color:var(--gold);background:var(--surf3);transform:translateY(-1px)}
.sp-slot.taken{opacity:.3;cursor:not-allowed;pointer-events:none}
.sp-slot-pos{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:1rem;color:var(--gold);line-height:1}
.sp-slot-full{font-size:.52rem;color:var(--txt2);margin-top:3px;line-height:1.3}
.sp-cancel{margin-top:10px;background:transparent;border:none;color:var(--muted);font-size:.65rem;cursor:pointer;padding:0;letter-spacing:1px;text-transform:uppercase;display:block}
.sp-cancel:hover{color:var(--red)}

/* COMPLETE XI */
.xi-list{background:var(--surf);border:1px solid var(--bdr);border-radius:10px;overflow:hidden}
.xi-row{display:flex;align-items:center;gap:11px;padding:10px 14px;border-bottom:1px solid var(--bdr2)}
.xi-row:last-child{border-bottom:none}
.xi-slot{font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:.82rem;color:var(--gold);min-width:42px}
.xi-name{flex:1;font-size:.84rem;font-weight:600}
.xi-rat{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:1.05rem;color:var(--gold)}
.sim-wrap{text-align:center;padding:24px 0 4px}
.pred-card{background:var(--surf3);border:1px solid rgba(201,162,39,.2);border-radius:8px;padding:16px;margin:16px 0 0;text-align:center}
/* Live commentary */
.commentary-wrap{padding:5px 14px 8px;display:flex;flex-wrap:wrap;gap:5px}
.commentary-evt{display:inline-flex;align-items:center;gap:4px;background:rgba(61,214,140,.08);border:1px solid rgba(61,214,140,.18);border-radius:4px;padding:3px 8px;font-size:.72rem}
.commentary-evt.opp{background:rgba(242,107,107,.08);border-color:rgba(242,107,107,.18)}
.comm-min{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:.78rem;color:var(--gold)}
.comm-icon{font-size:.7rem}
.comm-name{font-weight:600;color:var(--txt)}
.commentary-evt.opp .comm-name{color:var(--muted)}
.pred-label{font-size:.58rem;letter-spacing:3px;text-transform:uppercase;color:var(--muted);margin-bottom:8px}
.pred-stage{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:1.6rem;margin-bottom:4px;line-height:1}
.pred-detail{font-size:.78rem;color:var(--txt2);margin-bottom:14px;line-height:1.5}
.pred-bar-wrap{display:flex;gap:3px;height:6px;border-radius:3px;overflow:hidden;margin-bottom:5px}
.pred-bar-seg{flex:1;background:var(--surf);border-radius:2px;transition:background .3s}
.pred-bar-labels{display:flex;gap:3px}
.pred-bar-lbl{flex:1;font-size:.48rem;color:var(--muted);text-align:center;letter-spacing:.5px}
.pred-outcome{font-size:.82rem;font-weight:600;margin-bottom:6px;padding:8px 12px;background:var(--surf2);border-radius:5px;border:1px solid var(--bdr)}
.sim-rat{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:3.4rem;color:var(--gold);line-height:1}
.sim-rl{font-size:.58rem;letter-spacing:3px;text-transform:uppercase;color:var(--muted);margin-top:4px;margin-bottom:20px}
.btn-sim{background:linear-gradient(135deg,var(--gold),var(--gold2));color:#05080F;font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:1.2rem;letter-spacing:2px;padding:14px 48px;border:none;cursor:pointer;border-radius:4px;transition:all .18s;text-transform:uppercase}
.btn-sim:hover{transform:translateY(-2px);box-shadow:0 10px 28px rgba(201,162,39,.22)}

/* RESULTS */
.res{max-width:660px;margin:0 auto;padding:28px 16px 80px;background:#0A0F1C;min-height:100vh}
.res-stage{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:2rem;color:var(--gold);margin-bottom:3px}
.res-sub{font-size:.75rem;color:var(--muted);margin-bottom:24px}
.rcard{background:var(--surf);border:1px solid var(--bdr);border-radius:10px;overflow:hidden;margin-bottom:14px}
.rch{background:var(--surf2);padding:9px 14px;border-bottom:1px solid var(--bdr);font-size:.58rem;letter-spacing:3px;text-transform:uppercase;color:var(--muted)}
.mr{display:flex;align-items:center;gap:10px;padding:10px 14px;border-bottom:1px solid var(--bdr2)}
.mr:last-child{border-bottom:none}
.mr-t{flex:1;font-size:.84rem;font-weight:600}
.mr-s{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:1.28rem;min-width:50px;text-align:center}
.mr-s.W{color:var(--grn)}.mr-s.L{color:var(--red)}.mr-s.D{color:var(--yel)}
.mr-b{font-size:.58rem;font-weight:700;letter-spacing:1px;padding:2px 7px;border-radius:3px;text-transform:uppercase;flex-shrink:0}
.mr-b.W{background:rgba(61,214,140,.1);color:var(--grn)}
.mr-b.L{background:rgba(242,107,107,.1);color:var(--red)}
.mr-b.D{background:rgba(245,185,66,.1);color:var(--yel)}
.mr-pens{font-size:.62rem;color:var(--muted);padding:3px 14px 7px;font-style:italic}
.stage-lbl{font-size:.58rem;letter-spacing:2px;text-transform:uppercase;color:var(--muted);padding:8px 14px 2px}
.trophy{text-align:center;padding:26px;background:linear-gradient(135deg,rgba(201,162,39,.1),transparent);border-top:1px solid var(--gdim)}
.trophy-icon{font-size:3rem;margin-bottom:6px}
.trophy-txt{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:1.8rem;color:var(--gold)}
/* Confetti */
.confetti-wrap{position:fixed;inset:0;pointer-events:none;z-index:999;overflow:hidden}
.confetti-piece{position:absolute;top:-10px;width:8px;height:8px;border-radius:1px;animation:confettiFall linear forwards}
@keyframes confettiFall{
  0%  {transform:translateY(0) rotate(0deg);   opacity:1}
  80% {opacity:1}
  100%{transform:translateY(110vh) rotate(720deg); opacity:0}
}
/* Share buttons */
.share-btn{width:100%;padding:12px;border-radius:6px;font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:1rem;letter-spacing:1px;cursor:pointer;transition:all .15s;border:1px solid var(--gbright);background:var(--gdim);color:var(--gold);text-transform:uppercase}
.share-btn:hover{background:rgba(201,162,39,.25)}
.share-btn-url{background:rgba(255,255,255,.04);border-color:var(--bdr);color:var(--txt2)}
.share-btn-url:hover{background:rgba(255,255,255,.08)}
.share-btn-lb{background:rgba(61,214,140,.06);border-color:rgba(61,214,140,.25);color:var(--grn)}
.share-btn-lb:hover{background:rgba(61,214,140,.12)}
/* Share card */
.share-card{background:var(--surf2);border:1px solid var(--gdim);border-radius:10px;overflow:hidden;animation:fadeSlideIn .3s ease}
.sc-header{background:linear-gradient(135deg,#1a2436,#0A0F1C);padding:16px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--gdim)}
.sc-logo{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:1.6rem;color:var(--gold);letter-spacing:3px}
.sc-result{font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:.95rem;color:var(--gold-hi)}
.sc-team{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:1.4rem;color:var(--txt);padding:12px 16px 2px}
.sc-meta{font-size:.68rem;color:var(--muted);padding:0 16px 12px;letter-spacing:1px;text-transform:uppercase;border-bottom:1px solid var(--bdr)}
.sc-players{padding:8px 0}
.sc-player{display:flex;align-items:center;gap:10px;padding:7px 16px;border-bottom:1px solid var(--bdr2)}
.sc-player:last-child{border-bottom:none}
.sc-pos{font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:.78rem;color:var(--gold);min-width:34px}
.sc-name{flex:1;font-size:.84rem;font-weight:600}
.sc-rat{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:1rem;color:var(--gold)}
.sc-footer{text-align:center;padding:10px;font-size:.65rem;color:var(--muted);letter-spacing:2px;text-transform:uppercase;border-top:1px solid var(--bdr);background:rgba(0,0,0,.2)}
/* Head to Head */
.h2h-turn-banner{display:flex;align-items:center;justify-content:center;gap:0;margin-bottom:16px;background:var(--surf);border:1px solid var(--bdr);border-radius:8px;overflow:hidden}
.h2h-turn-player{flex:1;display:flex;align-items:center;gap:8px;padding:12px 14px;transition:all .2s;opacity:.45}
.h2h-turn-player.active{opacity:1;background:rgba(201,162,39,.07)}
.h2h-turn-num{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:.75rem;color:var(--gold);background:var(--gdim);padding:2px 6px;border-radius:3px}
.h2h-turn-name{font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:1rem;color:var(--txt);flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.h2h-turn-count{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:.9rem;color:var(--muted)}
.h2h-turn-player.active .h2h-turn-count{color:var(--gold)}
.h2h-turn-vs{padding:12px 10px;font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:.85rem;color:var(--muted);letter-spacing:1px;border-left:1px solid var(--bdr);border-right:1px solid var(--bdr)}
.h2h-winner-banner{text-align:center;padding:20px;background:linear-gradient(135deg,rgba(201,162,39,.12),transparent);border:1px solid var(--gdim);border-radius:8px;margin-bottom:4px}
.h2h-winner-txt{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:2rem;color:var(--gold);margin-top:4px}
/* Team name input */
.team-name-input{width:100%;background:var(--surf2);border:1px solid var(--bdr);border-radius:6px;padding:14px 16px;color:var(--txt);font-family:'Inter',sans-serif;font-size:1rem;outline:none;transition:border-color .15s}
.team-name-input:focus{border-color:var(--gold)}
.team-name-input::placeholder{color:var(--muted)}
/* Results team name */
.res-stage-name{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:1.1rem;color:var(--txt2);letter-spacing:2px;text-transform:uppercase;margin-bottom:2px}
/* Stat awards row */
.stat-awards{display:flex;gap:0;border-bottom:1px solid var(--bdr)}
.stat-award{flex:1;display:flex;align-items:center;gap:10px;padding:12px 14px;border-right:1px solid var(--bdr)}
.stat-award:last-child{border-right:none}
.stat-award-icon{font-size:1.4rem;flex-shrink:0}
.stat-award-label{font-size:.55rem;letter-spacing:2px;text-transform:uppercase;color:var(--muted)}
.stat-award-name{font-size:.82rem;font-weight:700;color:var(--txt);line-height:1.3;margin-top:1px}
.stat-award-val{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:.95rem;color:var(--gold);margin-top:1px}
/* Stat table */
.stat-table-head{display:flex;align-items:center;padding:6px 14px;background:var(--surf2);font-size:.6rem;letter-spacing:1.5px;text-transform:uppercase;color:var(--muted);border-bottom:1px solid var(--bdr)}
.stat-row{display:flex;align-items:center;padding:9px 14px;border-bottom:1px solid var(--bdr2);gap:6px}
.stat-row:last-child{border-bottom:none}
.stat-pos{font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:.78rem;color:var(--gold);min-width:34px}
.stat-col{width:36px;text-align:center;flex-shrink:0;font-size:.72rem}
.stat-num{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:1rem;color:var(--txt)}
/* Simulation animations */
@keyframes fadeSlideIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
@keyframes popIn{0%{transform:scale(.6);opacity:0}70%{transform:scale(1.15)}100%{transform:scale(1);opacity:1}}
@keyframes dotBounce{0%,80%,100%{transform:scale(0)}40%{transform:scale(1)}}
.sim-row{transition:background .2s}
.sim-row.active{background:rgba(201,162,39,.06)}
.sim-row.revealed{animation:fadeSlideIn .35s ease}
.mr-s.pending{color:var(--muted);font-size:.85rem;letter-spacing:1px}
.mr-b.pending{background:transparent;border:none}
.dot-pulse{display:inline-flex;gap:3px;align-items:center}
.dot-pulse i{display:inline-block;width:5px;height:5px;border-radius:50%;background:var(--gold);animation:dotBounce 1.2s ease-in-out infinite;font-style:normal}
.dot-pulse i:nth-child(1){animation-delay:0s}
.dot-pulse i:nth-child(2){animation-delay:.2s}
.dot-pulse i:nth-child(3){animation-delay:.4s}
`;

// ─── SLOT MACHINE COMPONENT ───────────────────────────────────────────────────
// Uses a CSS translateY animation on a tall strip of items for smooth scrolling.
// On landing: shows ONLY the winning team, no ghosts, no line.
function SlotMachine({ spinning, displayKey }) {
  const ITEM_H = 80;
  const [reelItems, setReelItems] = useState([]);
  const [translateY, setTranslateY] = useState(0);
  const [animating, setAnimating] = useState(false);
  const animRef = useRef(null);

  // When spinning starts, build a fresh strip and kick off interval-based scroll
  useEffect(() => {
    if (!spinning) return;
    // Build 60 random items
    const items = [];
    for (let i = 0; i < 60; i++) {
      items.push(SQUAD_KEYS[Math.floor(Math.random() * SQUAD_KEYS.length)]);
    }
    setReelItems(items);
    setTranslateY(0);
    setAnimating(true);

    let idx = 0;
    // Accelerate then slow: vary interval speed
    const speeds = [
      ...Array(8).fill(110),   // slow start
      ...Array(20).fill(65),   // fast middle
      ...Array(15).fill(80),   // slow down
    ];
    let si = 0;
    const step = () => {
      idx++;
      setTranslateY(-(idx * ITEM_H));
      si++;
      if (si < speeds.length) {
        animRef.current = setTimeout(step, speeds[si]);
      }
      // Don't stop here — parent stops spinning via setSpinning(false)
    };
    animRef.current = setTimeout(step, speeds[0]);
    return () => clearTimeout(animRef.current);
  }, [spinning]);

  // When spinning ends, stop cleanly
  useEffect(() => {
    if (!spinning) {
      clearTimeout(animRef.current);
      setAnimating(false);
    }
  }, [spinning]);

  // IDLE state
  if (!spinning && !displayKey) {
    return (
      <div className="slot-window">
        <div className="slot-idle">
          <div className="slot-idle-icon">⚽</div>
          <div className="slot-idle-txt">Ready to spin</div>
        </div>
      </div>
    );
  }

  // SPINNING: show scrolling strip
  if (spinning && reelItems.length > 0) {
    return (
      <div className="slot-window">
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0,
          transform: `translateY(${translateY}px)`,
          willChange: "transform"
        }}>
          {reelItems.map((k, i) => (
            <div key={i} className="slot-item">
              <span className="slot-flag">{SQUADS[k].flag}</span>
              <span className="slot-name">{k}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // LANDED: show ONLY the winner, clean and centred, no ghosts
  if (displayKey) {
    return (
      <div className="slot-window" style={{
        border: "1px solid var(--gbright)",
        background: "linear-gradient(135deg, rgba(201,162,39,0.08), var(--surf2))"
      }}>
        <div className="slot-item">
          <span className="slot-flag" style={{fontSize:"2rem"}}>{SQUADS[displayKey].flag}</span>
          <span className="slot-name" style={{color:"var(--gold-hi)",fontSize:"1.05rem",fontWeight:900}}>{displayKey}</span>
        </div>
      </div>
    );
  }

  return null;
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [phase, setPhase] = useState("home");
  const [difficulty, setDifficulty] = useState(null); // "easy"|"medium"|"hard"
  const [formation, setFormation] = useState(null);
  const [slots, setSlots] = useState([]);
  const [spinning, setSpinning] = useState(false);
  const [spinDisp, setSpinDisp] = useState(null);
  const [landedSquad, setLandedSquad] = useState(null);
  const [rerollsLeft, setRerollsLeft] = useState(0);
  const [usedMap, setUsedMap] = useState({});       // per-squad used (legacy, kept for compat)
  const [usedPlayers, setUsedPlayers] = useState(new Set()); // global player name dedup
  const [openPlayer, setOpenPlayer] = useState(null);
  const [filter, setFilter] = useState("ALL");
  const [teamName, setTeamName] = useState("");
  const [results, setResults] = useState(null);
  const [simFull, setSimFull] = useState(null);
  const [simMatches, setSimMatches] = useState([]);
  const [simStep, setSimStep] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);   // loaded from storage
  const [lbLoading, setLbLoading] = useState(false);
  const [shareCardVisible, setShareCardVisible] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [scoreSubmitted, setScoreSubmitted] = useState(false);
  const [eraFilter, setEraFilter] = useState("all");     // all|classic|golden|modern
  const [expertMode, setExpertMode] = useState(false);   // hide ratings during draft
  const [summaryText, setSummaryText] = useState("");     // AI generated summary
  const [summaryLoading, setSummaryLoading] = useState(false);
  // Commentary: per-match events {minute, type, playerName}
  const [matchEvents, setMatchEvents] = useState({});    // {matchIdx: [{min,type,name}]}
  const [activeMatchIdx, setActiveMatchIdx] = useState(-1);
  const [liveEvents, setLiveEvents] = useState([]);      // events for the ACTIVE match (resets each match)
  const [pinnedEvents, setPinnedEvents] = useState({});  // {matchIdx: events[]} — stays after match ends
  const [liveScore, setLiveScore] = useState({ga:0,gb:0}); // counts up during match
  const [simSkipped, setSimSkipped] = useState(false);
  const simTimeouts = React.useRef([]);
  const [personalBests, setPersonalBests] = useState(() => {
    try { return JSON.parse(localStorage.getItem("64-0-pb") || "null") || { best:0, bestStage:"", bestRat:0, runs:0, wins:0, history:[] }; }
    catch(e) { return { best:0, bestStage:"", bestRat:0, runs:0, wins:0, history:[] }; }
  });
  const [isNewPB, setIsNewPB] = useState(false);
  const [showMyStats, setShowMyStats] = useState(false);

  // ── HEAD TO HEAD STATE ──
  const [h2hMode, setH2hMode] = useState(false);          // are we in h2h mode?
  const [h2hTurn, setH2hTurn] = useState(1);              // 1 or 2
  const [h2hSlots1, setH2hSlots1] = useState([]);         // P1 filled slots
  const [h2hSlots2, setH2hSlots2] = useState([]);         // P2 filled slots
  const [h2hName1, setH2hName1] = useState("");
  const [h2hName2, setH2hName2] = useState("");
  const [h2hUsed1, setH2hUsed1] = useState(new Set());    // global dedup P1
  const [h2hUsed2, setH2hUsed2] = useState(new Set());    // global dedup P2
  const [h2hSim1, setH2hSim1] = useState(null);
  const [h2hSim2, setH2hSim2] = useState(null);
  const [h2hSimStep, setH2hSimStep] = useState(0);
  const [h2hMatches1, setH2hMatches1] = useState([]);
  const [h2hMatches2, setH2hMatches2] = useState([]);

  const REROLLS = { easy: 3, medium: 1, hard: 0, expert: 0 };

  // Era filter — which squads are available to spin
  const ERA_RANGES = {
    all:     [1966, 2026],
    classic: [1966, 1990],
    golden:  [1994, 2006],
    modern:  [2010, 2026],
  };
  const availableSquads = eraFilter === "all"
    ? SQUAD_KEYS
    : SQUAD_KEYS.filter(k => {
        const yr = SQUADS[k].yr;
        const [min, max] = ERA_RANGES[eraFilter] || [1966, 2026];
        return yr >= min && yr <= max;
      });

  // Predict tournament outcome based on team rating
  function getPrediction(rat) {
    const r = rat || 0;
    if (r >= 93) return { stage:"🏆 Champions",    detail:"A legendary squad. You should win the whole thing.",        colour:"#F0C040", rank:7 };
    if (r >= 90) return { stage:"🥈 Final",         detail:"World class. Expect to reach the final at minimum.",        colour:"#C9A227", rank:6 };
    if (r >= 87) return { stage:"🥉 Semi-Final",    detail:"A strong squad. The semis look very achievable.",           colour:"#C9A227", rank:5 };
    if (r >= 84) return { stage:"⚽ Quarter-Final", detail:"Solid team. You should make the last eight.",               colour:"#9BA8BC", rank:4 };
    if (r >= 81) return { stage:"⚽ Round of 16",   detail:"Decent squad. Getting out of the group should be fine.",    colour:"#9BA8BC", rank:3 };
    if (r >= 78) return { stage:"⚠️ Group Stage",   detail:"Tough ask. You may struggle to qualify from the group.",    colour:"#F87171", rank:2 };
    return               { stage:"❌ Early Exit",    detail:"This squad will find it very difficult to progress.",       colour:"#F87171", rank:1 };
  }

  // Score a result for leaderboard ranking
  function resultRank(simResult) {
    if (!simResult) return 0;
    if (simResult.champion) return 7;
    const stageMap = { "Final":6, "Semi-Final":5, "Quarter-Final":4, "Round of 16":3, "Group Stage":2 };
    return stageMap[simResult.elim] || 1;
  }
  function resultLabel(simResult) {
    if (!simResult) return "–";
    if (simResult.champion) return "🏆 Champions";
    const icons = { "Final":"🥈 Final", "Semi-Final":"🥉 Semi-Final", "Quarter-Final":"⚽ Quarter-Final", "Round of 16":"⚽ Round of 16", "Group Stage":"❌ Group Stage" };
    return icons[simResult.elim] || simResult.elim;
  }

  // Load leaderboard from shared storage
  async function loadLeaderboard() {
    setLbLoading(true);
    try {
      const res = await window.storage.get("lb_v1", true);
      if (res) setLeaderboard(JSON.parse(res.value));
    } catch(e) { setLeaderboard([]); }
    setLbLoading(false);
  }

  // Submit score to shared leaderboard
  async function submitScore() {
    if (scoreSubmitted || !simFull) return;
    const entry = {
      name: teamName || "Anonymous",
      formation,
      difficulty,
      rating: teamRat,
      result: resultLabel(simFull),
      rank: resultRank(simFull),
      players: slots.map(s => ({ name: s.player.name, pos: s.player.pos, rat: s.player.rat, squad: s.squadKey })),
      ts: Date.now(),
    };
    try {
      // Get current board
      let board = [];
      try { const r = await window.storage.get("lb_v1", true); if(r) board = JSON.parse(r.value); } catch(e){}
      board.push(entry);
      // Sort by rank desc, then rating desc, keep top 100
      board.sort((a,b) => b.rank - a.rank || b.rating - a.rating);
      board = board.slice(0, 100);
      await window.storage.set("lb_v1", JSON.stringify(board), true);
      setLeaderboard(board);
      setScoreSubmitted(true);
    } catch(e) { console.error("Leaderboard save failed", e); }
  }

  // Encode XI into a shareable URL hash
  function buildShareUrl() {
    const data = {
      n: teamName || "Anonymous XI",
      f: formation,
      d: difficulty,
      r: resultLabel(simFull),
      rat: teamRat,
      p: slots.map(s => {
        const sl = (formation ? FORMATIONS[formation] : []).find(x => x.id === s.slotId);
        return [sl?.label || s.slotId, s.player.name, s.player.pos, s.player.rat];
      }),
    };
    const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(data))));
    return window.location.href.split("?")[0] + "?xi=" + encoded;
  }

  function copyShareUrl() {
    const url = buildShareUrl();
    navigator.clipboard.writeText(url).then(() => {
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2500);
    });
  }

  const fSlots = formation ? FORMATIONS[formation] : [];
  // In h2h mode, current turn's slots drive the pitch/draft UI
  const activeSlots = h2hMode ? (h2hTurn === 1 ? h2hSlots1 : h2hSlots2) : slots;
  const activeUsed  = h2hMode ? (h2hTurn === 1 ? h2hUsed1  : h2hUsed2)  : usedPlayers;
  const filledIds = new Set(activeSlots.map(s => s.slotId));
  const openSlots = fSlots.filter(s => !filledIds.has(s.id));
  const complete = !h2hMode && formation && openSlots.length === 0;
  const myPlayers = slots.map(s => s.player);
  const teamRat = myPlayers.length ? Math.round(avgRat(myPlayers)) : 0;
  const h2hRat1 = h2hSlots1.length ? Math.round(avgRat(h2hSlots1.map(s=>s.player))) : 0;
  const h2hRat2 = h2hSlots2.length ? Math.round(avgRat(h2hSlots2.map(s=>s.player))) : 0;

  function startGame(f, diff) {
    const d = diff || difficulty;
    setDifficulty(d);
    setFormation(f); setSlots([]); setSpinning(false); setSpinDisp(null);
    setLandedSquad(null); setRerollsLeft(REROLLS[d]); setUsedMap({}); setOpenPlayer(null); setFilter("ALL");
    setPhase("teamname");
  }
  function confirmTeamName() {
    setPhase("game");
  }

  function spin() {
    if (spinning || landedSquad) return;
    setSpinning(true); setSpinDisp(null); setOpenPlayer(null);
    let t = 0;
    const total = 22 + Math.floor(Math.random() * 12);
    const iv = setInterval(() => {
      t++;
      if (t >= total) {
        clearInterval(iv);
        const landed = availableSquads[Math.floor(Math.random() * availableSquads.length)];
        setSpinDisp(landed); setLandedSquad(landed); setSpinning(false);
      }
    }, 75);
  }

  // FIX #3: clicking a player row opens the inline slot chooser below their name
  function togglePlayer(p, squadKey) {
    if (openPlayer && openPlayer.player.name === p.name && openPlayer.squadKey === squadKey) {
      setOpenPlayer(null);
    } else {
      setOpenPlayer({ player: p, squadKey });
    }
  }

  function placeInSlot(slot) {
    if (h2hMode) { h2hPlaceInSlot(slot); return; }
    if (!openPlayer || filledIds.has(slot.id)) return;
    if (!canFill(openPlayer.player.pos, slot.label)) return;
    setSlots(prev => [...prev, { slotId: slot.id, player: openPlayer.player, squadKey: openPlayer.squadKey }]);
    setUsedMap(prev => ({ ...prev, [openPlayer.squadKey]: new Set([...(prev[openPlayer.squadKey] || []), openPlayer.player.name]) }));
    setUsedPlayers(prev => new Set([...prev, openPlayer.player.name]));
    setOpenPlayer(null); setLandedSquad(null); setSpinDisp(null);
  }

  function reroll() {
    if (!landedSquad || rerollsLeft <= 0 || spinning) return;
    setRerollsLeft(r => r - 1);
    setLandedSquad(null); setSpinDisp(null); setOpenPlayer(null);
    // Immediately spin again
    setSpinning(true);
    let t = 0;
    const total = 18 + Math.floor(Math.random() * 10);
    const iv = setInterval(() => {
      t++;
      if (t >= total) {
        clearInterval(iv);
        const landed = availableSquads[Math.floor(Math.random() * availableSquads.length)];
        setSpinDisp(landed); setLandedSquad(landed); setSpinning(false);
      }
    }, 75);
  }

  function runSim() {
    const full = simulate(myPlayers, availableSquads);
    const allMatches = [
      ...full.group.map(g => ({ kind:"group", data:g })),
      ...full.rounds.map(r => ({ kind:"round",  data:r })),
    ];
    setSimStep(0);
    setSimMatches(allMatches);
    setSimFull(full);
    setMatchEvents(full.allEvents || {});
    setLiveEvents([]);
    setActiveMatchIdx(-1);
    setScoreSubmitted(false);
    setShareCardVisible(false);
    setShareCopied(false);
    setPhase("results");
    // Store timeouts so skip can clear them
    simTimeouts.current.forEach(clearTimeout);
    simTimeouts.current = [];

    // Build a flat timeline of all events across all matches
    // Each match: show opponent name first, then count up goals, then lock result
    let cursor = 1000; // ms from now
    const GOAL_DELAY = 2000;  // ms between goal events
    const MATCH_GAP  = 3000;  // ms pause between matches

    allMatches.forEach((_, i) => {
      const evts = (full.allEvents || {})[i] || [];
      const matchResult = i < full.group.length ? full.group[i] : full.rounds[i - full.group.length];

      // Start this match — show 0-0
      const t0 = cursor;
      simTimeouts.current.push(setTimeout(() => {
        setActiveMatchIdx(i);
        setLiveEvents([]);
        setLiveScore({ga:0, gb:0});
      }, t0));
      cursor += 400;

      // Reveal each goal event, counting up the score
      evts.forEach((evt, ei) => {
        const t = cursor;
        simTimeouts.current.push(setTimeout(() => {
          setLiveEvents(prev => [...prev, evt]);
          setLiveScore(prev => ({
            ga: prev.ga + (evt.type === "goal" ? 1 : 0),
            gb: prev.gb + (evt.type === "opp_goal" ? 1 : 0),
          }));
        }, t));
        cursor += GOAL_DELAY;
      });

      // Lock the match result — reveal final score + W/D/L badge, pin events
      const tEnd = cursor + 1000;
      simTimeouts.current.push(setTimeout(() => {
        setSimStep(i + 1);
        setPinnedEvents(prev => ({...prev, [i]: evts}));
        setLiveEvents([]);
      }, tEnd));
      cursor = tEnd + MATCH_GAP;
    });

    // Final cleanup
    simTimeouts.current.push(setTimeout(() => setActiveMatchIdx(-1), cursor));
    // Auto-submit to leaderboard once simulation completes
    const totalDelay = allMatches.length * 900 + 400;
    setTimeout(async () => {
      const entry = {
        name: teamName || "Anonymous",
        formation,
        difficulty,
        rating: myPlayers.length ? Math.round(avgRat(myPlayers)) : 0,
        result: resultLabel(full),
        rank: resultRank(full),
        W: full.W || 0, D: full.D || 0, L: full.L || 0,
        players: slots.map(s => ({ name: s.player.name, pos: s.player.pos, rat: s.player.rat, squad: s.squadKey })),
        ts: Date.now(),
      };
      try {
        let board = [];
        try { const r = await window.storage.get("lb_v1", true); if(r) board = JSON.parse(r.value); } catch(e){}
        board.push(entry);
        board.sort((a,b) => b.rank - a.rank || b.rating - a.rating);
        board = board.slice(0, 100);
        await window.storage.set("lb_v1", JSON.stringify(board), true);
        setLeaderboard(board);
        setScoreSubmitted(true);
      } catch(e) {}

      // Generate AI season summary
      setSummaryLoading(true);
      try {
        const topScorer = Object.entries(full.playerStats || {})
          .sort((a,b) => b[1].goals - a[1].goals)[0];
        const resultStr = full.champion ? "won the World Cup" : `were eliminated in the ${full.elim}`;
        const wdl = `${full.W}W ${full.D}D ${full.L}L`;
        const rat = myPlayers.length ? Math.round(avgRat(myPlayers)) : 0;
        const topNames = myPlayers.slice(0,3).map(p=>p.name).join(", ");
        const prompt = `Write a punchy 2-sentence football tournament summary for a World Cup draft game. The team was rated ${rat}/100, had key players including ${topNames}. They ${resultStr} with a record of ${wdl}.${topScorer ? ` Top scorer was ${topScorer[0]} with ${topScorer[1].goals} goals.` : ""} Write it like a dramatic sports journalist. Start with the team's journey, end with the key moment. No hashtags, no emojis, under 60 words.`;
        const resp = await fetch("https://api.anthropic.com/v1/messages", {
          method:"POST",
          headers:{"Content-Type":"application/json"},
          body: JSON.stringify({
            model:"claude-sonnet-4-6",
            max_tokens:120,
            messages:[{role:"user",content:prompt}]
          })
        });
        const data = await resp.json();
        const txt = data.content?.[0]?.text || "";
        setSummaryText(txt);
      } catch(e) { setSummaryText(""); }
      setSummaryLoading(false);

      // Save personal best to localStorage
      try {
        const rank = resultRank(full);
        const rat  = myPlayers.length ? Math.round(avgRat(myPlayers)) : 0;
        const prev = JSON.parse(localStorage.getItem("64-0-pb") || "null") || { best:0, bestStage:"", bestRat:0, runs:0, wins:0, history:[] };
        const newPB = rank > prev.best || (rank === prev.best && rat > prev.bestRat);
        const updated = {
          best:      newPB ? rank : prev.best,
          bestStage: newPB ? resultLabel(full) : prev.bestStage,
          bestRat:   newPB ? rat : prev.bestRat,
          runs:      (prev.runs || 0) + 1,
          wins:      (prev.wins || 0) + (full.champion ? 1 : 0),
          history:   [{
            stage: resultLabel(full),
            rat, formation, difficulty,
            name: teamName || "Unnamed",
            champion: !!full.champion,
            ts: Date.now(),
          }, ...(prev.history || [])].slice(0, 10),
        };
        localStorage.setItem("64-0-pb", JSON.stringify(updated));
        setPersonalBests(updated);
        if (newPB) setIsNewPB(true);
      } catch(e) {}
    }, totalDelay);
  }
  function skipSimulation() {
    // Clear all pending timeouts
    simTimeouts.current.forEach(clearTimeout);
    simTimeouts.current = [];
    // Jump to full reveal
    if (simFull) {
      const total = simFull.group.length + simFull.rounds.length;
      setSimStep(total);
      setActiveMatchIdx(-1);
      setLiveEvents([]);
      // Pin all events
      const allPinned = {};
      Object.entries(simFull.allEvents || {}).forEach(([k,v]) => { allPinned[k] = v; });
      setPinnedEvents(allPinned);
      setSimSkipped(true);
    }
  }

  function restart() {
    setPhase("home"); setDifficulty(null); setFormation(null); setSlots([]); setSpinning(false);
    setSpinDisp(null); setLandedSquad(null); setRerollsLeft(0); setUsedMap({}); setOpenPlayer(null);
    setFilter("ALL"); setResults(null); setSimFull(null); setSimMatches([]); setSimStep(0); setUsedPlayers(new Set()); setTeamName(""); setScoreSubmitted(false); setShareCardVisible(false); setShowLeaderboard(false); setIsNewPB(false); setShowMyStats(false); setEraFilter('all'); setExpertMode(false); setSummaryText(''); setMatchEvents({}); setLiveEvents([]); setPinnedEvents({}); setLiveScore({ga:0,gb:0}); setActiveMatchIdx(-1); setSimSkipped(false);
    // reset h2h
    setH2hMode(false); setH2hTurn(1); setH2hSlots1([]); setH2hSlots2([]);
    setH2hName1(""); setH2hName2(""); setH2hUsed1(new Set()); setH2hUsed2(new Set());
    setH2hSim1(null); setH2hSim2(null); setH2hSimStep(0); setH2hMatches1([]); setH2hMatches2([]);
  }

  function startH2h(f, diff) {
    setH2hMode(true); setH2hTurn(1); setH2hSlots1([]); setH2hSlots2([]);
    setH2hUsed1(new Set()); setH2hUsed2(new Set());
    setH2hSim1(null); setH2hSim2(null);
    setFormation(f); setDifficulty(diff);
    setSlots([]); setSpinning(false); setSpinDisp(null);
    setLandedSquad(null); setRerollsLeft(REROLLS[diff]);
    setUsedMap({}); setUsedPlayers(new Set());
    setOpenPlayer(null); setFilter("ALL");
    setPhase("game");
  }

  function h2hPlaceInSlot(slot) {
    if (!openPlayer || !h2hMode) return;
    const p = openPlayer.player;
    const sq = openPlayer.squadKey;
    if (!canFill(p.pos, slot.label)) return;
    const entry = { slotId: slot.id, player: p, squadKey: sq };
    if (h2hTurn === 1) {
      if (h2hSlots1.some(s => s.slotId === slot.id)) return;
      const newSlots = [...h2hSlots1, entry];
      setH2hSlots1(newSlots);
      setH2hUsed1(prev => new Set([...prev, p.name]));
    } else {
      if (h2hSlots2.some(s => s.slotId === slot.id)) return;
      const newSlots = [...h2hSlots2, entry];
      setH2hSlots2(newSlots);
      setH2hUsed2(prev => new Set([...prev, p.name]));
    }
    setOpenPlayer(null); setLandedSquad(null); setSpinDisp(null);
    // Switch turn — unless both are full
    const p1Done = h2hTurn === 1 ? (h2hSlots1.length + 1) >= fSlots.length : h2hSlots1.length >= fSlots.length;
    const p2Done = h2hTurn === 2 ? (h2hSlots2.length + 1) >= fSlots.length : h2hSlots2.length >= fSlots.length;
    if (p1Done && p2Done) {
      // Both complete — go to sim
      setPhase("h2h-sim");
    } else {
      setH2hTurn(t => t === 1 ? 2 : 1);
      setRerollsLeft(REROLLS[difficulty]);
    }
  }

  function runH2hSim() {
    const players1 = h2hSlots1.map(s => s.player);
    const players2 = h2hSlots2.map(s => s.player);
    const full1 = simulate(players1);
    const full2 = simulate(players2);
    setH2hSim1(full1); setH2hSim2(full2);
    const all1 = [...full1.group.map(g=>({kind:"group",data:g})),...full1.rounds.map(r=>({kind:"round",data:r}))];
    const all2 = [...full2.group.map(g=>({kind:"group",data:g})),...full2.rounds.map(r=>({kind:"round",data:r}))];
    setH2hMatches1(all1); setH2hMatches2(all2);
    setH2hSimStep(0);
    setPhase("h2h-results");
    const maxLen = Math.max(all1.length, all2.length);
    for (let i = 0; i <= maxLen; i++) {
      setTimeout(() => setH2hSimStep(i + 1), (i + 1) * 900);
    }
  }

  const sqPlayers = landedSquad ? SQUADS[landedSquad].players : [];
  const usedSet = usedMap[landedSquad] || new Set();

  const GK_POS  = new Set(["GK"]);
  const DEF_POS = new Set(["RB","LB","CB","RWB","LWB"]);
  const MID_POS = new Set(["CDM","CM","CAM","RM","LM","RW","LW"]);
  const FWD_POS = new Set(["ST","CF","RW","LW","CAM","RM","LM"]);

  const filtered = sqPlayers.filter(p => {
    if (filter === "GK")  return GK_POS.has(p.pos);
    if (filter === "DEF") return DEF_POS.has(p.pos);
    if (filter === "MID") return MID_POS.has(p.pos) && !FWD_POS.has(p.pos) || DEF_POS.has(p.pos) && p.pos === "CDM";
    if (filter === "FWD") return FWD_POS.has(p.pos);
    return true;
  });

  // Which open slots can this player fill?
  const eligibleSlotsFor = (p) => openSlots.filter(s => canFill(p.pos, s.label));
  const canFitAnyOpen = (p) => eligibleSlotsFor(p).length > 0;

  return (
    <div className="app-root">
      <style>{CSS}</style>

      {/* NAV */}
      <nav className="nav">
        <div>
          <div className="logo">64-0</div>
          <div className="logo-sub">World Cup Draft</div>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          {phase !== "home" && <button className="btn-ghost" onClick={restart}>↩ New Run</button>}
          {phase === "game" && !complete && teamName && <span style={{fontSize:".75rem",color:"var(--txt2)",fontWeight:600,maxWidth:120,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{teamName}</span>}
          {phase === "game" && !complete && <>
            <span style={{fontSize:".7rem",color:"var(--muted)",fontVariantNumeric:"tabular-nums"}}>{slots.length}/11</span>
            {difficulty && <span style={{fontSize:".65rem",color:"var(--gold)",padding:"2px 7px",border:"1px solid var(--gdim)",borderRadius:3,textTransform:"capitalize"}}>{difficulty}</span>}
          </>}
        </div>
      </nav>

      {/* HOME */}
      {phase === "home" && (
        <div className="hero">
          <div className="eye">World Cup Draft Game</div>
          <h1 className="hero-title">64<span>-0</span></h1>
          <p className="hero-desc">Spin the reel. Draft legends from every World Cup era. Build your ultimate XI and simulate the tournament.</p>
          {personalBests.runs > 0 && (
            <div style={{marginTop:18,padding:"10px 18px",background:"var(--surf)",border:"1px solid var(--gdim)",borderRadius:6,display:"inline-block",fontSize:".8rem",color:"var(--txt2)"}}>
              Your best: <strong style={{color:"var(--gold)"}}>{(personalBests.bestStage.split(" ").slice(1).join(" ") || personalBests.bestStage)}</strong>
              <span style={{color:"var(--muted)",marginLeft:6}}>· {personalBests.runs} run{personalBests.runs!==1?"s":""} · {personalBests.wins} win{personalBests.wins!==1?"s":""}</span>
              <span style={{color:"var(--muted)",marginLeft:6}}>— can you do better?</span>
            </div>
          )}
          <button className="btn-primary" onClick={() => setPhase("difficulty")} style={{marginTop:16}}>Start New Run →</button>
          <div style={{marginTop:14,display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
            <button className="btn-ghost" onClick={() => { setH2hName1(""); setH2hName2(""); setDifficulty(null); setFormation(null); setPhase("h2h-setup"); }}>
              ⚔️ Head to Head
            </button>
            <button className="btn-ghost" onClick={() => { loadLeaderboard(); setShowLeaderboard(true); setPhase("leaderboard"); }}>
              🏆 Leaderboard
            </button>
            {personalBests.runs > 0 && (
              <button className="btn-ghost" onClick={() => setPhase("mystats")}>
                📈 My Stats
              </button>
            )}
          </div>
          <div className="hero-stats">
            <div><div className="hs-n">{SQUAD_KEYS.length}</div><div className="hs-l">Squads</div></div>
            <div><div className="hs-n">880+</div><div className="hs-l">Players</div></div>
            <div><div className="hs-n">1966–2026</div><div className="hs-l">Eras</div></div>
            <div><div className="hs-n">5</div><div className="hs-l">Formations</div></div>
          </div>
        </div>
      )}

      {/* MY STATS */}
      {phase === "mystats" && (
        <div className="fp" style={{maxWidth:540,margin:"0 auto"}}>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:24}}>
            <button className="btn-ghost" onClick={() => setPhase("home")}>← Back</button>
            <div className="fp-title" style={{margin:0}}>📈 My Stats</div>
          </div>

          {/* Summary cards */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:16}}>
            {[
              {label:"Runs Played", val:personalBests.runs},
              {label:"Tournaments Won", val:personalBests.wins},
              {label:"Win Rate", val:`${personalBests.runs>0?Math.round((personalBests.wins/personalBests.runs)*100):0}%`},
            ].map((s,i) => (
              <div key={i} style={{background:"var(--surf)",border:"1px solid var(--bdr)",borderRadius:8,padding:"14px 10px",textAlign:"center"}}>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:"1.6rem",color:"var(--gold)"}}>{s.val}</div>
                <div style={{fontSize:".6rem",color:"var(--muted)",letterSpacing:1,textTransform:"uppercase",marginTop:3}}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Personal best */}
          <div className="rcard" style={{marginBottom:14}}>
            <div className="rch">🏅 Personal Best</div>
            <div style={{padding:"16px 14px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:"1.6rem",color:"var(--gold)"}}>{personalBests.bestStage || "–"}</div>
                <div style={{fontSize:".7rem",color:"var(--muted)",marginTop:2}}>Best tournament result</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:"1.6rem",color:"var(--gold)"}}>{personalBests.bestRat}</div>
                <div style={{fontSize:".7rem",color:"var(--muted)",marginTop:2}}>Best team rating</div>
              </div>
            </div>
          </div>

          {/* Run history */}
          {personalBests.history.length > 0 && (
            <div className="rcard">
              <div className="rch">Recent Runs</div>
              {personalBests.history.map((h,i) => (
                <div key={i} className="mr" style={{padding:"10px 14px"}}>
                  <div style={{flex:1}}>
                    <div style={{fontSize:".84rem",fontWeight:600,color:h.champion?"var(--gold)":"var(--txt)"}}>{h.name}</div>
                    <div style={{fontSize:".65rem",color:"var(--muted)",marginTop:1}}>{h.formation} · {h.difficulty}</div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:".82rem",fontWeight:700,color:h.champion?"var(--gold)":resultRank({champion:h.champion,elim:h.stage.replace(/[^a-zA-Z\s-]/g,"").trim()})>=5?"var(--grn)":"var(--txt2)"}}>{h.stage.split(" ").slice(1).join(" ") || h.stage}</div>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:".95rem",color:"var(--gold)"}}>{h.rat}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={{textAlign:"center",marginTop:20}}>
            <button className="btn-ghost" style={{color:"var(--red)",borderColor:"rgba(242,107,107,.3)"}}
              onClick={() => { if(window.confirm("Reset all your stats? This cannot be undone.")) { localStorage.removeItem("64-0-pb"); setPersonalBests({best:0,bestStage:"",bestRat:0,runs:0,wins:0,history:[]}); setPhase("home"); }}}>
              Reset My Stats
            </button>
          </div>
        </div>
      )}

      {/* LEADERBOARD */}
      {phase === "leaderboard" && (
        <div className="fp" style={{maxWidth:660,margin:"0 auto"}}>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:24}}>
            <button className="btn-ghost" onClick={() => setPhase("home")}>← Back</button>
            <div className="fp-title" style={{margin:0}}>🏆 Leaderboard</div>
          </div>
          <div style={{fontSize:".72rem",color:"var(--muted)",marginBottom:16,letterSpacing:1}}>Top 100 teams ranked by best tournament result</div>
          {lbLoading ? (
            <div style={{textAlign:"center",padding:40,color:"var(--muted)"}}>Loading…</div>
          ) : leaderboard.length === 0 ? (
            <div style={{textAlign:"center",padding:40,color:"var(--muted)"}}>
              <div style={{fontSize:"2rem",marginBottom:8}}>🏟️</div>
              <div>No entries yet — be the first to play and submit!</div>
            </div>
          ) : (
            <div className="rcard">
              <div className="stat-table-head">
                <span style={{width:28,flexShrink:0}}>#</span>
                <span style={{flex:1}}>Team</span>
                <span style={{width:72,textAlign:"center",flexShrink:0}}>Record</span>
                <span style={{width:56,textAlign:"center",flexShrink:0}}>Result</span>
                <span style={{width:36,textAlign:"center",flexShrink:0}}>Rat</span>
              </div>
              {leaderboard.map((e,i) => (
                <div key={i} className="stat-row" style={{gap:8}}>
                  <span style={{width:28,flexShrink:0,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:"1rem",color:i===0?"var(--gold)":i===1?"#C0C0C0":i===2?"#CD7F32":"var(--muted)"}}>{i+1}</span>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:".84rem",fontWeight:700,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{e.name}</div>
                    <div style={{fontSize:".62rem",color:"var(--muted)",marginTop:1}}>{e.formation} · {e.difficulty}</div>
                  </div>
                  <span style={{width:72,textAlign:"center",flexShrink:0,fontSize:".72rem",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700}}>
                    <span style={{color:"var(--grn)"}}>{e.W ?? "–"}W</span>
                    {" "}<span style={{color:"var(--yel)"}}>{e.D ?? "–"}D</span>
                    {" "}<span style={{color:"var(--red)"}}>{e.L ?? "–"}L</span>
                  </span>
                  <span style={{width:56,textAlign:"center",flexShrink:0,fontSize:".65rem",color:e.rank===7?"var(--gold)":e.rank>=5?"var(--grn)":"var(--txt2)"}}>{e.result.replace("🏆 ","").replace("🥈 ","").replace("🥉 ","").replace("⚽ ","").replace("❌ ","")}</span>
                  <span style={{width:36,textAlign:"center",flexShrink:0,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:"1rem",color:"var(--gold)"}}>{e.rating}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* H2H SETUP */}
      {phase === "h2h-setup" && (
        <div className="fp">
          <div className="fp-title">⚔️ Head to Head</div>
          <div className="fp-sub">Both players draft on the same device, taking turns</div>
          <div style={{maxWidth:440,margin:"0 auto",display:"flex",flexDirection:"column",gap:14}}>
            <div>
              <div style={{fontSize:".7rem",color:"var(--gold)",letterSpacing:2,textTransform:"uppercase",marginBottom:6}}>Player 1 Name</div>
              <input className="team-name-input" type="text" placeholder="e.g. Player 1" value={h2hName1} maxLength={20} onChange={e=>setH2hName1(e.target.value)} />
            </div>
            <div>
              <div style={{fontSize:".7rem",color:"var(--gold)",letterSpacing:2,textTransform:"uppercase",marginBottom:6}}>Player 2 Name</div>
              <input className="team-name-input" type="text" placeholder="e.g. Player 2" value={h2hName2} maxLength={20} onChange={e=>setH2hName2(e.target.value)} />
            </div>
            <div>
              <div style={{fontSize:".7rem",color:"var(--muted)",letterSpacing:2,textTransform:"uppercase",marginBottom:8}}>Difficulty</div>
              <div style={{display:"flex",gap:8}}>
                {["easy","medium","hard"].map(d=>(
                  <div key={d} className="fp-card" style={{flex:1,padding:"12px 8px",textAlign:"center",borderColor:difficulty===d?"var(--gold)":"var(--bdr)",background:difficulty===d?"var(--surf3)":"var(--surf)"}} onClick={()=>setDifficulty(d)}>
                    <div style={{fontSize:"1.3rem"}}>{d==="easy"?"😌":d==="medium"?"😤":"💀"}</div>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:"1rem",color:difficulty===d?"var(--gold)":"var(--txt)",marginTop:4,textTransform:"capitalize"}}>{d}</div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div style={{fontSize:".7rem",color:"var(--muted)",letterSpacing:2,textTransform:"uppercase",marginBottom:8}}>Formation</div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                {Object.keys(FORMATIONS).map(f=>(
                  <div key={f} className="fp-card" style={{flex:1,minWidth:80,padding:"10px 6px",textAlign:"center",borderColor:formation===f?"var(--gold)":"var(--bdr)",background:formation===f?"var(--surf3)":"var(--surf)"}} onClick={()=>setFormation(f)}>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:"1.2rem",color:formation===f?"var(--gold)":"var(--txt)"}}>{f}</div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div style={{fontSize:".7rem",color:"var(--muted)",letterSpacing:2,textTransform:"uppercase",marginBottom:8}}>Era Filter</div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                {[
                  {key:"all",     label:"All Eras",   sub:"1966–2026"},
                  {key:"classic", label:"Classic",    sub:"1966–1990"},
                  {key:"golden",  label:"Golden Era", sub:"1994–2006"},
                  {key:"modern",  label:"Modern",     sub:"2010–2026"},
                ].map(e => (
                  <div
                    key={e.key}
                    className="fp-card"
                    style={{flex:1,minWidth:80,padding:"8px 6px",textAlign:"center",borderColor:eraFilter===e.key?"var(--gold)":"var(--bdr)",background:eraFilter===e.key?"var(--surf3)":"var(--surf)"}}
                    onClick={() => setEraFilter(e.key)}
                  >
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:".9rem",color:eraFilter===e.key?"var(--gold)":"var(--txt)"}}>{e.label}</div>
                    <div style={{fontSize:".55rem",color:"var(--muted)",marginTop:2}}>{e.sub}</div>
                  </div>
                ))}
              </div>
            </div>
            <button
              className="btn-primary"
              style={{width:"100%",marginTop:6,opacity:(h2hName1&&h2hName2&&difficulty&&formation)?1:.4,pointerEvents:(h2hName1&&h2hName2&&difficulty&&formation)?"auto":"none"}}
              onClick={()=>startH2h(formation,difficulty)}
            >
              Start Draft →
            </button>
          </div>
        </div>
      )}

      {/* DIFFICULTY PICKER */}
      {phase === "difficulty" && (
        <div className="fp">
          <div className="fp-title">Choose Difficulty</div>
          <div className="fp-sub">How many rerolls do you get if you don't like the country you land on?</div>
          <div className="fp-grid" style={{maxWidth:600,margin:"0 auto"}}>
            {[
              {key:"easy",   label:"Easy",   sub:"3 Rerolls",  desc:"Reroll up to 3 times per spin",           icon:"😌"},
              {key:"medium", label:"Medium", sub:"1 Reroll",   desc:"One chance to avoid a bad squad",         icon:"😤"},
              {key:"hard",   label:"Hard",   sub:"No Rerolls", desc:"You get what you spin. No mercy.",        icon:"💀"},
              {key:"expert", label:"Expert", sub:"No Rerolls", desc:"Ratings hidden — draft on knowledge alone", icon:"🧠"},
            ].map(d => (
              <div
                className="fp-card diff-card"
                key={d.key}
                onClick={() => { setDifficulty(d.key); setExpertMode(d.key==="expert"); setPhase("formation"); }}
                style={{minWidth:140}}
              >
                <div style={{fontSize:"2rem",marginBottom:8}}>{d.icon}</div>
                <div className="fp-label">{d.label}</div>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:"1rem",color:"var(--gold)",marginTop:4}}>{d.sub}</div>
                <div className="fp-sub2" style={{marginTop:6,letterSpacing:.5,textTransform:"none",fontSize:".72rem",lineHeight:1.4}}>{d.desc}</div>
              </div>
            ))}
          </div>

          {/* Era Filter */}
          <div style={{maxWidth:600,margin:"20px auto 0"}}>
            <div style={{fontSize:".7rem",color:"var(--muted)",letterSpacing:2,textTransform:"uppercase",marginBottom:10,textAlign:"center"}}>Era Filter</div>
            <div style={{display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap"}}>
              {[
                {key:"all",     label:"All Eras",    sub:"1966–2026"},
                {key:"classic", label:"Classic",     sub:"1966–1990"},
                {key:"golden",  label:"Golden Era",  sub:"1994–2006"},
                {key:"modern",  label:"Modern",      sub:"2010–2026"},
              ].map(e => (
                <div
                  key={e.key}
                  className="fp-card"
                  style={{padding:"10px 16px",textAlign:"center",minWidth:110,borderColor:eraFilter===e.key?"var(--gold)":"var(--bdr)",background:eraFilter===e.key?"var(--surf3)":"var(--surf)"}}
                  onClick={() => setEraFilter(e.key)}
                >
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:"1rem",color:eraFilter===e.key?"var(--gold)":"var(--txt)"}}>{e.label}</div>
                  <div style={{fontSize:".62rem",color:"var(--muted)",marginTop:2}}>{e.sub}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{display:"none"}}>
          </div>
        </div>
      )}

      {/* FORMATION PICKER */}
      {phase === "formation" && (
        <div className="fp">
          <div className="fp-title">Pick Your Formation</div>
          <div className="fp-sub">This determines which positions you're drafting for</div>
          <div className="fp-grid">
            {Object.keys(FORMATIONS).map(f => (
              <div className="fp-card" key={f} onClick={() => startGame(f, difficulty)}>
                <div className="fp-label">{f}</div>
                <div className="fp-sub2">{f==="4-4-2"?"Classic":f==="4-3-3"?"Attacking":f==="4-2-3-1"?"Modern":f==="3-5-2"?"Wing-backs":"Defensive"}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TEAM NAME */}
      {phase === "teamname" && (
        <div className="fp">
          <div className="fp-title">Name Your Team</div>
          <div className="fp-sub">Give your dream XI a name before kick-off</div>
          <div style={{maxWidth:400,margin:"0 auto"}}>
            <input
              className="team-name-input"
              type="text"
              placeholder="e.g. FC Legends, The Immortals…"
              value={teamName}
              maxLength={30}
              onChange={e => setTeamName(e.target.value)}
              onKeyDown={e => e.key === "Enter" && confirmTeamName()}
              autoFocus
            />
            <button
              className="btn-primary"
              style={{width:"100%",marginTop:16}}
              onClick={confirmTeamName}
            >
              {teamName.trim() ? `Play as ${teamName.trim()} →` : "Skip & Play →"}
            </button>
          </div>
        </div>
      )}

      {/* GAME */}
      {phase === "game" && formation && (
        <div className="game">
          {h2hMode && (
            <div className="h2h-turn-banner">
              <div className={`h2h-turn-player${h2hTurn===1?" active":""}`}>
                <span className="h2h-turn-num">P1</span>
                <span className="h2h-turn-name">{h2hName1 || "Player 1"}</span>
                <span className="h2h-turn-count">{h2hSlots1.length}/11</span>
              </div>
              <div className="h2h-turn-vs">VS</div>
              <div className={`h2h-turn-player${h2hTurn===2?" active":""}`}>
                <span className="h2h-turn-num">P2</span>
                <span className="h2h-turn-name">{h2hName2 || "Player 2"}</span>
                <span className="h2h-turn-count">{h2hSlots2.length}/11</span>
              </div>
            </div>
          )}
          <div className="prog-wrap"><div className="prog-bar" style={{width:h2hMode?`${((h2hSlots1.length+h2hSlots2.length)/22)*100}%`:`${(slots.length/11)*100}%`}}/></div>

          {!complete ? (
            <div className="cols">
              {/* PITCH */}
              <div>
                <div className="sh">Formation — {formation}</div>
                <div className="pitch-wrap">
                  <div className="pitch-hdr">
                    <div className="pitch-fm">{formation}</div>
                    {slots.length > 0 && !expertMode && <div style={{textAlign:"right"}}><div className="pitch-rat">{teamRat}</div><div className="pitch-rl">Avg Rating</div></div>}
                  </div>
                  <Pitch fSlots={fSlots} slots={activeSlots} openPlayer={openPlayer} onPlace={placeInSlot} expertMode={expertMode} />
                </div>
              </div>

              {/* SPIN + SQUAD */}
              <div>
                <div className="sh">Draft</div>
                <div className="spin-panel">
                  <div className="slot-machine">
                    <SlotMachine spinning={spinning} displayKey={spinDisp} landed={landedSquad} />
                  </div>
                  <button className="spin-btn" onClick={spin} disabled={spinning || !!landedSquad || complete}>
                    {spinning ? "▶▶ Spinning…" : landedSquad ? "↓ Pick a player below" : "SPIN"}
                  </button>
                  {landedSquad && rerollsLeft > 0 && (
                    <button className="reroll-btn" onClick={reroll} disabled={spinning}>
                      🔄 Reroll <span className="reroll-pip-row">{Array.from({length:REROLLS[difficulty]}).map((_,i) => <span key={i} className={`reroll-pip${i < rerollsLeft ? " on" : ""}`}/>)}</span>
                    </button>
                  )}
                  {landedSquad && (
                    <div className="landed-banner">
                      <span style={{fontSize:"1.4rem",flexShrink:0}}>{SQUADS[landedSquad].flag}</span>
                      <div>
                        <div style={{fontWeight:700,color:"var(--gold)",fontSize:".85rem",marginBottom:3}}>{landedSquad}</div>
                        <div style={{fontSize:".75rem",color:"var(--txt2)",lineHeight:1.5}}>{SQUAD_FACTS[landedSquad] || ""}</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* SQUAD LIST */}
                {landedSquad && (
                  <div style={{marginTop:0}}>
                    <div className="sq-hdr">
                      <div className="sq-flag">{SQUADS[landedSquad].flag}</div>
                      <div><span className="sq-name">{landedSquad}</span><span className="sq-yr"> {SQUADS[landedSquad].yr}</span></div>
                    </div>
                    <div className="ftabs">
                      {["ALL","GK","DEF","MID","FWD"].map(g => (
                        <button key={g} className={`ft${filter===g?" act":""}`} onClick={() => setFilter(g)}>{g}</button>
                      ))}
                    </div>
                    <div className="plist">
                      {filtered.map(p => {
                        const isUsed = usedSet.has(p.name) || activeUsed.has(p.name);
                        const eligSlots = eligibleSlotsFor(p);
                        const fits = eligSlots.length > 0;
                        const isOpen = openPlayer?.player.name === p.name && openPlayer?.squadKey === landedSquad;
                        return (
                          <div
                            key={p.name}
                            className={`pr${isUsed?" used":""}${!fits&&!isUsed?" inel":""}${isOpen?" sel":""}`}
                            onClick={() => !isUsed && fits && togglePlayer(p, landedSquad)}
                          >
                            <div className="pr-main">
                              <div className="pr-rat">{expertMode ? '?' : p.rat}</div>
                              <div className="pr-info">
                                <div className="pr-name">{p.name}</div>
                                <div className="pr-pos">{p.pos}</div>
                              </div>
                              {isOpen
                                ? <span className="pr-tag sel">Pick slot ↓</span>
                                : fits && !isUsed
                                  ? <span className="pr-tag elig">eligible</span>
                                  : !isUsed && <span className="pr-tag dim">no open slot</span>
                              }
                            </div>
                            {/* FIX #3: inline slot picker expands below the player row */}
                            {isOpen && (
                              <div className="slot-picker">
                                <div className="sp-label">Choose position slot</div>
                                <div className="sp-slots">
                                  {fSlots.filter(s => canFill(p.pos, s.label)).map(s => {
                                    const taken = filledIds.has(s.id);
                                    return (
                                      <div
                                        key={s.id}
                                        className={`sp-slot${taken?" taken":""}`}
                                        onClick={e => { e.stopPropagation(); if(!taken) placeInSlot(s); }}
                                      >
                                        <div className="sp-slot-pos">{s.label}</div>
                                        <div className="sp-slot-full">{s.full}</div>
                                        {taken && <div style={{fontSize:".44rem",color:"var(--red)",marginTop:2}}>filled</div>}
                                      </div>
                                    );
                                  })}
                                </div>
                                <button className="sp-cancel" onClick={e => { e.stopPropagation(); setOpenPlayer(null); }}>✕ cancel</button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* XI COMPLETE */
            <div className="cols">
              <div>
                <div className="sh">Your XI — {formation}</div>
                <div className="pitch-wrap">
                  <div className="pitch-hdr">
                    <div className="pitch-fm">{formation}</div>
                    <div style={{textAlign:"right"}}><div className="pitch-rat">{teamRat}</div><div className="pitch-rl">Team Rating</div></div>
                  </div>
                  <Pitch fSlots={fSlots} slots={slots} openPlayer={null} onPlace={() => {}} expertMode={expertMode} />
                </div>
              </div>
              <div>
                <div className="sh">Squad</div>
                <div className="xi-list">
                  {slots.map((s,i) => {
                    const sl = fSlots.find(f => f.id === s.slotId);
                    return (
                      <div key={i} className="xi-row">
                        <span className="xi-slot">{sl?.label}</span>
                        <span className="xi-name">{s.player.name}</span>
                        <span className="xi-rat">{s.player.rat}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="sim-wrap">
                  <div className="sim-rat">{expertMode ? <span style={{fontSize:'2rem',opacity:.4}}>?</span> : teamRat}</div>
                  <div className="sim-rl">{expertMode ? 'Rating Hidden' : 'Team Rating'}</div>

                  {/* Prediction card — hidden in expert mode */}
                  {!expertMode && (() => {
                    const pred = getPrediction(teamRat);
                    return (
                      <div className="pred-card" style={{borderColor:pred.colour+"44"}}>
                        <div className="pred-label">📊 BOOKIES&apos; PREDICTION</div>
                        <div className="pred-stage" style={{color:pred.colour}}>{pred.stage}</div>
                        <div className="pred-detail">{pred.detail}</div>
                        {/* Prediction bar */}
                        <div className="pred-bar-wrap">
                          {["Group","R16","QF","SF","Final","🏆"].map((seg,si) => (
                            <div key={si} className={`pred-bar-seg${si < pred.rank ? " lit" : ""}`}
                              style={{background: si < pred.rank ? pred.colour : undefined}}
                            />
                          ))}
                        </div>
                        <div className="pred-bar-labels">
                          {["Group","R16","QF","SF","Final","🏆"].map((seg,si) => (
                            <span key={si} className="pred-bar-lbl">{seg}</span>
                          ))}
                        </div>
                      </div>
                    );
                  })()}

                  <button className="btn-sim" onClick={runSim} style={{marginTop:20}}>
                    Simulate Tournament →
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* H2H SIM CONFIRM */}
      {phase === "h2h-sim" && (
        <div className="fp">
          <div className="fp-title">⚔️ Both XIs Complete!</div>
          <div className="fp-sub">Ready to simulate both tournaments simultaneously?</div>
          <div style={{maxWidth:500,margin:"0 auto",display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:24}}>
            {[{name:h2hName1||"Player 1",slots:h2hSlots1,rat:h2hRat1},{name:h2hName2||"Player 2",slots:h2hSlots2,rat:h2hRat2}].map((p,pi)=>(
              <div key={pi} className="rcard">
                <div className="rch">{p.name}</div>
                {p.slots.map((s,i)=>{
                  const sl=fSlots.find(f=>f.id===s.slotId);
                  return <div key={i} className="xi-row"><span className="xi-slot">{sl?.label}</span><span style={{flex:1,fontSize:".78rem",fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{s.player.name}</span><span className="xi-rat">{s.player.rat}</span></div>;
                })}
                <div style={{padding:"8px 14px",borderTop:"1px solid var(--bdr)",display:"flex",justifyContent:"space-between"}}>
                  <span style={{fontSize:".65rem",color:"var(--muted)"}}>Avg Rating</span>
                  <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,color:"var(--gold)"}}>{p.rat}</span>
                </div>
              </div>
            ))}
          </div>
          <button className="btn-primary" style={{display:"block",margin:"0 auto"}} onClick={runH2hSim}>Simulate Both →</button>
        </div>
      )}

      {/* H2H RESULTS */}
      {phase === "h2h-results" && h2hSim1 && h2hSim2 && (
        <div className="res" style={{maxWidth:760}}>
          {/* Winner banner */}
          {h2hSimStep > Math.max(h2hMatches1.length, h2hMatches2.length) && (() => {
            const r1 = resultRank(h2hSim1), r2 = resultRank(h2hSim2);
            const rat1 = h2hRat1, rat2 = h2hRat2;
            const winner = r1>r2?"p1":r2>r1?"p2":rat1>rat2?"p1":rat2>rat1?"p2":"draw";
            return (
              <div className="h2h-winner-banner" style={{animation:"fadeSlideIn .6s ease"}}>
                {winner==="draw"
                  ? <><div style={{fontSize:"2rem"}}>🤝</div><div className="h2h-winner-txt">It's a Draw!</div></>
                  : <><div style={{fontSize:"2rem"}}>🏆</div><div className="h2h-winner-txt">{winner==="p1"?h2hName1||"Player 1":h2hName2||"Player 2"} Wins!</div></>
                }
              </div>
            );
          })()}

          {/* Side by side columns */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginTop:16}}>
            {[
              {name:h2hName1||"P1",sim:h2hSim1,matches:h2hMatches1,slots:h2hSlots1,rat:h2hRat1,idx:0},
              {name:h2hName2||"P2",sim:h2hSim2,matches:h2hMatches2,slots:h2hSlots2,rat:h2hRat2,idx:1},
            ].map(p => (
              <div key={p.idx}>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:"1.1rem",color:"var(--gold)",marginBottom:4,textAlign:"center"}}>{p.name}</div>
                <div style={{fontSize:".72rem",color:"var(--muted)",textAlign:"center",marginBottom:10}}>
                  {p.sim.W}W {p.sim.D}D {p.sim.L}L · Rat {p.rat}
                </div>

                {/* Group */}
                <div className="rcard" style={{marginBottom:8}}>
                  <div className="rch">Group</div>
                  {p.sim.group.map((g,i)=>{
                    const matchIdx = p.idx===0 ? i : i;
                    const revealed = h2hSimStep > i;
                    return (
                      <div key={i} className={`mr sim-row${revealed?" revealed":""}`} style={{padding:"8px 10px",gap:6}}>
                        <div style={{flex:1,fontSize:".75rem",fontWeight:700,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.name}</div>
                        {revealed
                          ? <><div className={`mr-s ${g.out}`} style={{fontSize:"1rem",minWidth:40,animation:"popIn .3s ease"}}>{g.ga}–{g.gb}</div><span className={`mr-b ${g.out}`}>{g.out}</span></>
                          : <><div className="mr-s pending" style={{fontSize:".78rem",minWidth:40}}>vs</div>{h2hSimStep===i&&<span className="dot-pulse"><i/><i/><i/></span>}</>
                        }
                      </div>
                    );
                  })}
                  {h2hSimStep >= 3 && (()=>{
                    const pts=p.sim.group.reduce((s,g)=>s+(g.out==="W"?3:g.out==="D"?1:0),0);
                    return <div style={{padding:"5px 10px",borderTop:"1px solid var(--bdr2)",fontSize:".68rem",color:pts>=4?"var(--grn)":"var(--red)",fontWeight:700}}>{pts} pts — {pts>=4?"✓ Through":"✗ Out"}</div>;
                  })()}
                </div>

                {/* Knockout */}
                {p.sim.rounds.length>0 && h2hSimStep>3 && (
                  <div className="rcard" style={{animation:"fadeSlideIn .4s ease"}}>
                    <div className="rch">Knockout</div>
                    {p.sim.rounds.map((r,i)=>{
                      const mi=3+i;
                      const revealed=h2hSimStep>mi;
                      return (
                        <div key={i}>
                          <div className="stage-lbl" style={{padding:"5px 10px 1px",fontSize:".55rem"}}>{r.stage}</div>
                          <div className={`mr sim-row${revealed?" revealed":""}`} style={{padding:"7px 10px",gap:6}}>
                            <div style={{flex:1,fontSize:".75rem",fontWeight:700}}>{p.name}</div>
                            {revealed
                              ? <><div className={`mr-s ${r.won?"W":"L"}`} style={{fontSize:"1rem",minWidth:40,animation:"popIn .3s ease"}}>{r.ga}–{r.gb}</div><span className={`mr-b ${r.won?"W":"L"}`}>{r.won?"W":"L"}</span></>
                              : <><div className="mr-s pending" style={{fontSize:".78rem",minWidth:40}}>vs</div>{h2hSimStep===mi&&<span className="dot-pulse"><i/><i/><i/></span>}</>
                            }
                          </div>
                          {revealed&&r.pens&&<div className="mr-pens" style={{padding:"2px 10px 5px",fontSize:".6rem"}}>{r.pens}</div>}
                        </div>
                      );
                    })}
                    {h2hSimStep>=Math.max(h2hMatches1.length,h2hMatches2.length)&&p.sim.champion&&(
                      <div style={{textAlign:"center",padding:"12px",borderTop:"1px solid var(--gdim)",animation:"fadeSlideIn .5s ease"}}>
                        <div style={{fontSize:"1.8rem"}}>🏆</div>
                        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:"1.1rem",color:"var(--gold)"}}>Champions</div>
                      </div>
                    )}
                  </div>
                )}

                {/* Final result pill */}
                {h2hSimStep>=Math.max(h2hMatches1.length,h2hMatches2.length)&&(
                  <div style={{textAlign:"center",marginTop:8,fontSize:".8rem",color:p.sim.champion?"var(--gold)":resultRank(p.sim)>=5?"var(--grn)":"var(--muted)",fontWeight:700,animation:"fadeSlideIn .4s ease"}}>
                    {resultLabel(p.sim)}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div style={{textAlign:"center",marginTop:24}}>
            <button className="btn-primary" onClick={restart}>Play Again →</button>
          </div>
        </div>
      )}

      {/* RESULTS */}
      {phase === "results" && simFull && simFull.champion && simStep >= simMatches.length && (
        <Confetti />
      )}
      {phase === "results" && simFull && (
        <div className="res">
          {/* Header — only show final outcome once all matches revealed */}
          {simStep >= simMatches.length ? (
            <div className="res-stage" style={{animation:"fadeSlideIn .5s ease"}}>
              {simFull.champion ? "🏆 World Champions" : `Eliminated — ${simFull.elim}`}
            </div>
          ) : (
            <div className="res-stage" style={{color:"var(--muted)"}}>Simulating…</div>
          )}
          {simStep >= simMatches.length && (() => {
            const pred = getPrediction(teamRat);
            const actual = resultRank(simFull);
            const beat = actual > pred.rank;
            const matched = actual === pred.rank;
            return (
              <div className="pred-outcome" style={{animation:"fadeSlideIn .5s ease"}}>
                {beat    && <span style={{color:"var(--grn)"}}>✓ Beat the prediction! We predicted {pred.stage}</span>}
                {matched && <span style={{color:"var(--gold)"}}>= Matched the prediction — exactly as expected</span>}
                {!beat && !matched && <span style={{color:"var(--red)"}}>✗ Fell short — we predicted {pred.stage}</span>}
              </div>
            );
          })()}
          {isNewPB && simStep >= simMatches.length && (
            <div style={{padding:"10px 14px",marginBottom:8,background:"linear-gradient(135deg,rgba(61,214,140,.12),rgba(61,214,140,.04))",border:"1px solid rgba(61,214,140,.3)",borderRadius:6,textAlign:"center",animation:"fadeSlideIn .5s ease"}}>
              <span style={{fontSize:"1.1rem"}}>🎉</span>
              <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:"1rem",color:"var(--grn)",marginLeft:8,letterSpacing:1}}>NEW PERSONAL BEST!</span>
            </div>
          )}
          <div className="res-stage-name">{teamName || "Your XI"}</div>
          <div className="res-sub">
            Team Rating: {teamRat} · {formation} · {difficulty}
            {simFull && <span style={{marginLeft:10}}>
              <span style={{color:"var(--grn)",fontWeight:700}}>{simFull.W}W</span>
              {" "}<span style={{color:"var(--yel)",fontWeight:700}}>{simFull.D}D</span>
              {" "}<span style={{color:"var(--red)",fontWeight:700}}>{simFull.L}L</span>
            </span>}
          </div>

          {/* SKIP BUTTON — visible while simulating */}
          {simStep < simMatches.length && !simSkipped && (
            <div style={{textAlign:"right",marginBottom:8}}>
              <button onClick={skipSimulation} style={{background:"transparent",border:"1px solid var(--bdr)",color:"var(--muted)",padding:"4px 12px",borderRadius:4,cursor:"pointer",fontSize:".7rem",letterSpacing:1,textTransform:"uppercase",fontFamily:"'Inter',sans-serif"}}>
                Skip →
              </button>
            </div>
          )}

          {/* GROUP STAGE */}
          <div className="rcard">
            <div className="rch">Group Stage</div>
            {simFull.group.map((g,i) => {
              const revealed = simStep > i;
              const active   = activeMatchIdx === i;
              const eventsToShow = active ? liveEvents : (pinnedEvents[i] || []);
              // Live score: count up during active match, show final when revealed
              const displayScore = active
                ? `${liveScore.ga}–${liveScore.gb}`
                : revealed ? `${g.ga}–${g.gb}` : null;
              return (
                <div key={i}>
                  <div className={`mr sim-row${revealed?" revealed":""}${active?" active":""}`}>
                    <div className="mr-t" style={{fontWeight:700}}>Your XI</div>
                    {(revealed || active) ? (
                      <>
                        <div className={`mr-s${revealed?" "+g.out:""}`} style={{animation:revealed?"popIn .3s ease":"none",minWidth:48,textAlign:"center"}}>
                          {displayScore}
                        </div>
                        <div className="mr-t" style={{textAlign:"right"}}>{g.opp.flag} {g.opp.key}</div>
                        {revealed
                          ? <span className={`mr-b ${g.out}`} style={{animation:"popIn .3s ease"}}>{g.out}</span>
                          : <span className="mr-b pending" style={{minWidth:28}}><span className="dot-pulse"><i/><i/><i/></span></span>
                        }
                      </>
                    ) : (
                      <>
                        <div className="mr-s pending">vs</div>
                        <div className="mr-t" style={{textAlign:"right",color:"var(--muted)"}}>{g.opp.flag} {g.opp.key}</div>
                        <span className="mr-b pending" style={{minWidth:28}}/>
                      </>
                    )}
                  </div>
                  {eventsToShow.length > 0 && (
                    <div className="commentary-wrap">
                      {eventsToShow.map((evt,ei) => (
                        <div key={ei} className={`commentary-evt${evt.type==="opp_goal"?" opp":""}`} style={{animation:active?"fadeSlideIn .25s ease":"none"}}>
                          <span className="comm-min">{evt.min}&apos;</span>
                          <span className="comm-icon">⚽</span>
                          <span className="comm-name">{evt.type==="goal" ? evt.name.split(" ").slice(-1)[0] : evt.name}</span>
                          {evt.type==="opp_goal" && <span style={{fontSize:".6rem",color:"var(--muted)",marginLeft:4}}>(opp)</span>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            {simStep >= 3 && (() => {
              const pts = simFull.group.reduce((s,g)=>s+(g.out==="W"?3:g.out==="D"?1:0),0);
              const qualified = pts >= 4;
              return (
                <div style={{padding:"8px 14px",borderTop:"1px solid var(--bdr2)",display:"flex",alignItems:"center",justifyContent:"space-between",animation:"fadeSlideIn .4s ease"}}>
                  <span style={{fontSize:".72rem",color:"var(--muted)"}}>Group points</span>
                  <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:"1.1rem",color:qualified?"var(--grn)":"var(--red)"}}>
                    {pts} pts — {qualified ? "✓ Qualified" : "✗ Eliminated"}
                  </span>
                </div>
              );
            })()}
          </div>

          {/* KNOCKOUT STAGE */}
          {simFull.rounds.length > 0 && simStep > 3 && (
            <div className="rcard" style={{animation:"fadeSlideIn .4s ease"}}>
              <div className="rch">Knockout Stage</div>
              {simFull.rounds.map((r,i) => {
                const matchIdx = 3 + i;
                const revealed = simStep > matchIdx;
                const active   = simStep === matchIdx;
                return (
                  <div key={i}>
                    <div className="stage-lbl">{r.stage}</div>
                    <div className={`mr sim-row${revealed?" revealed":""}${active?" active":""}`}>
                      <div className="mr-t" style={{fontWeight:700}}>Your XI</div>
                      {(revealed || active) ? (
                        <>
                          <div className={`mr-s${revealed?" "+(r.won?"W":"L"):""}`} style={{animation:revealed?"popIn .3s ease":"none",minWidth:48,textAlign:"center"}}>
                            {active ? `${liveScore.ga}–${liveScore.gb}` : `${r.ga}–${r.gb}`}
                          </div>
                          <div className="mr-t" style={{textAlign:"right"}}>{r.opp.flag} {r.opp.key}</div>
                          {revealed
                            ? <span className={`mr-b ${r.won?"W":"L"}`} style={{animation:"popIn .3s ease"}}>{r.won?"W":"L"}</span>
                            : <span className="mr-b pending" style={{minWidth:28}}><span className="dot-pulse"><i/><i/><i/></span></span>
                          }
                        </>
                      ) : (
                        <>
                          <div className="mr-s pending">vs</div>
                          <div className="mr-t" style={{textAlign:"right",color:"var(--muted)"}}>{r.opp.flag} {r.opp.key}</div>
                          <span className="mr-b pending" style={{minWidth:28}}/>
                        </>
                      )}
                    </div>
                    {(() => {
                      const mi = 3 + i;
                      const koEvts = activeMatchIdx === mi ? liveEvents : (pinnedEvents[mi] || []);
                      return koEvts.length > 0 ? (
                        <div className="commentary-wrap">
                          {koEvts.map((evt,ei) => (
                            <div key={ei} className={`commentary-evt${evt.type==="opp_goal"?" opp":""}`} style={{animation:activeMatchIdx===mi?"fadeSlideIn .25s ease":"none"}}>
                              <span className="comm-min">{evt.min}&apos;</span>
                              <span className="comm-icon">⚽</span>
                              <span className="comm-name">{evt.type==="goal" ? evt.name.split(" ").slice(-1)[0] : evt.name}</span>
                              {evt.type==="opp_goal" && <span style={{fontSize:".6rem",color:"var(--muted)",marginLeft:4}}>(opp)</span>}
                            </div>
                          ))}
                        </div>
                      ) : null;
                    })()}
                    {revealed && r.pens && <div className="mr-pens" style={{animation:"fadeSlideIn .3s ease"}}>{r.pens}</div>}
                  </div>
                );
              })}
              {simStep >= simMatches.length && simFull.champion && (
                <div className="trophy" style={{animation:"fadeSlideIn .6s ease"}}>
                  <div className="trophy-icon">🏆</div>
                  <div className="trophy-txt">World Champions</div>
                </div>
              )}
            </div>
          )}
          {/* PLAYER STATS — only show once simulation is complete */}
          {simStep >= simMatches.length && simFull?.playerStats && (() => {
            const ps = simFull.playerStats;
            // Build rows for each slot player
            // Preserve formation order: GK first, then DEF, MID, FWD
            const POS_ORDER = {"GK":0,"RB":1,"LB":2,"CB":3,"RWB":4,"LWB":5,"CDM":6,"CM":7,"CAM":8,"RM":9,"LM":10,"RW":11,"LW":12,"CF":13,"ST":14};
            const rows = slots.map(s => {
              const sl = fSlots.find(f => f.id === s.slotId);
              const st = ps[s.player.name] || {goals:0,assists:0,cleanSheets:0};
              const isDef = ["GK","RB","LB","CB","RWB","LWB","RCB","LCB","CCB"].includes(s.player.pos);
              const posOrder = POS_ORDER[s.player.pos] ?? 15;
              return { sl, player:s.player, st, isDef, posOrder };
            }).sort((a,b) => a.posOrder - b.posOrder);

            const topScorer = [...rows].sort((a,b)=>b.st.goals-a.st.goals)[0];
            const topAssist = [...rows].sort((a,b)=>b.st.assists-a.st.assists)[0];
            const topCS     = [...rows].filter(r=>r.isDef).sort((a,b)=>b.st.cleanSheets-a.st.cleanSheets)[0];
            const totalGoals = rows.reduce((s,r)=>s+r.st.goals,0);

            return (
              <div className="rcard" style={{marginTop:14,animation:"fadeSlideIn .5s ease"}}>
                <div className="rch">Player Statistics</div>
                {/* Headline awards */}
                <div className="stat-awards">
                  {topScorer?.st.goals > 0 && (
                    <div className="stat-award">
                      <div className="stat-award-icon">⚽</div>
                      <div><div className="stat-award-label">Top Scorer</div><div className="stat-award-name">{topScorer.player.name}</div><div className="stat-award-val">{topScorer.st.goals} goals</div></div>
                    </div>
                  )}
                  {topAssist?.st.assists > 0 && (
                    <div className="stat-award">
                      <div className="stat-award-icon">🎯</div>
                      <div><div className="stat-award-label">Top Assist</div><div className="stat-award-name">{topAssist.player.name}</div><div className="stat-award-val">{topAssist.st.assists} assists</div></div>
                    </div>
                  )}
                  {topCS?.st.cleanSheets > 0 && (
                    <div className="stat-award">
                      <div className="stat-award-icon">🧤</div>
                      <div><div className="stat-award-label">Clean Sheets</div><div className="stat-award-name">{topCS.player.name}</div><div className="stat-award-val">{topCS.st.cleanSheets} kept</div></div>
                    </div>
                  )}
                </div>
                {/* Per-player table */}
                <div className="stat-table-head">
                  <span style={{flex:1}}>Player</span>
                  <span className="stat-col">⚽</span>
                  <span className="stat-col">🎯</span>
                  <span className="stat-col">🧤</span>
                </div>
                {rows.map((r,i) => (
                  <div key={i} className="stat-row">
                    <span className="stat-pos">{r.sl?.label}</span>
                    <span style={{flex:1,fontSize:".84rem",fontWeight:600}}>{r.player.name}</span>
                    <span className="stat-col stat-num">{r.st.goals > 0 ? r.st.goals : <span style={{color:"var(--muted)"}}>–</span>}</span>
                    <span className="stat-col stat-num">{r.st.assists > 0 ? r.st.assists : <span style={{color:"var(--muted)"}}>–</span>}</span>
                    <span className="stat-col stat-num">
                      {r.isDef
                        ? (r.st.cleanSheets > 0 ? r.st.cleanSheets : <span style={{color:"var(--muted)"}}>0</span>)
                        : <span style={{color:"var(--muted)"}}>–</span>}
                    </span>
                  </div>
                ))}
                <div style={{padding:"8px 14px",borderTop:"1px solid var(--bdr2)",display:"flex",justifyContent:"space-between",fontSize:".72rem",color:"var(--muted)"}}>
                  <span>Total goals scored</span>
                  <span style={{color:"var(--gold)",fontWeight:700,fontFamily:"'Barlow Condensed',sans-serif",fontSize:".95rem"}}>{totalGoals}</span>
                </div>
              </div>
            );
          })()}

          <div className="rcard" style={{marginTop:14}}>
            <div className="rch">{teamName || "Your XI"} — {formation}</div>
            {slots.map((s,i) => {
              const sl = fSlots.find(f => f.id === s.slotId);
              return (
                <div key={i} className="mr">
                  <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:".82rem",color:"var(--gold)",minWidth:42}}>{sl?.label}</span>
                  <span style={{flex:1,fontSize:".84rem",fontWeight:600}}>{s.player.name}</span>
                  <span style={{fontSize:".68rem",color:"var(--muted)"}}>{s.squadKey}</span>
                  <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:"1.05rem",color:"var(--gold)",marginLeft:8}}>{s.player.rat}</span>
                </div>
              );
            })}
          </div>
          {/* SHARE + LEADERBOARD ACTIONS */}
          {simStep >= simMatches.length && (
            <div style={{marginTop:20,display:"flex",flexDirection:"column",gap:10}}>

              {/* Share card button */}
              <button
                className="share-btn"
                onClick={() => setShareCardVisible(v => !v)}
              >
                {shareCardVisible ? "✕ Close Share Card" : "📋 Share Your XI"}
              </button>

              {shareCardVisible && (
                <div className="share-card" id="share-card">
                  <div className="sc-header">
                    <div className="sc-logo">64-0</div>
                    <div className="sc-result">{resultLabel(simFull)}</div>
                  </div>
                  <div className="sc-team">{teamName || "My XI"}</div>
                  <div className="sc-meta">
                    {formation} · Rating {teamRat} · {difficulty}
                    {simFull && ` · ${simFull.W}W ${simFull.D}D ${simFull.L}L`}
                  </div>
                  <div className="sc-players">
                    {slots.map((s,i) => {
                      const sl = fSlots.find(f => f.id === s.slotId);
                      return (
                        <div key={i} className="sc-player">
                          <span className="sc-pos">{sl?.label}</span>
                          <span className="sc-name">{s.player.name}</span>
                          <span className="sc-rat">{s.player.rat}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="sc-footer">64-0.com</div>
                </div>
              )}

              {/* Copy URL button */}
              <button className="share-btn share-btn-url" onClick={copyShareUrl}>
                {shareCopied ? "✓ Link copied!" : "🔗 Copy shareable link"}
              </button>

              {/* View leaderboard */}
              <button className="share-btn share-btn-lb" onClick={() => { loadLeaderboard(); setPhase("leaderboard"); }}>
                🏆 {scoreSubmitted ? "View Leaderboard — you're on it!" : "View Leaderboard"}
              </button>

            </div>
          )}

          {/* AI Season Summary */}
          {(summaryLoading || summaryText) && simStep >= simMatches.length && (
            <div className="rcard" style={{marginTop:14,animation:"fadeSlideIn .5s ease"}}>
              <div className="rch">📰 Tournament Summary</div>
              <div style={{padding:"14px 16px",fontSize:".88rem",lineHeight:1.7,color:"var(--txt2)",fontStyle:"italic"}}>
                {summaryLoading
                  ? <div style={{display:"flex",alignItems:"center",gap:8,color:"var(--muted)"}}><span className="dot-pulse"><i/><i/><i/></span> Writing summary…</div>
                  : summaryText}
              </div>
            </div>
          )}

          <div style={{textAlign:"center",marginTop:16}}>
            <button className="btn-primary" onClick={restart}>Play Again →</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── CONFETTI COMPONENT ───────────────────────────────────────────────────────
// Pre-generate confetti data once at module level so it never causes re-renders
const CONFETTI_DATA = (() => {
  const colours = ["#C9A227","#F0C040","#ffffff","#3DD68C","#F26B6B","#60A5FA","#F5B942","#E879F9"];
  return Array.from({length:100}, (_,i) => ({
    left:  Math.random() * 100,
    delay: Math.random() * 3,
    dur:   2.5 + Math.random() * 2.5,
    colour: colours[Math.floor(Math.random() * colours.length)],
    size:  6 + Math.random() * 8,
    isRect: Math.random() > 0.5,
  }));
})();

function Confetti() {
  return (
    <div className="confetti-wrap">
      {CONFETTI_DATA.map((p,i) => (
        <div
          key={i}
          className="confetti-piece"
          style={{
            left:`${p.left}%`,
            background: p.colour,
            width: p.isRect ? p.size*1.5 : p.size,
            height: p.size,
            borderRadius: p.isRect ? "1px" : "50%",
            animationDuration:`${p.dur}s`,
            animationDelay:`${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

// ─── PITCH COMPONENT ──────────────────────────────────────────────────────────
// Column x% centres: col1=12%, col2=30%, col3=50%(centre), col4=70%, col5=88%
// Row y% centres:    row1=8.3%(FWD top), row2=25%, row3=41.7%, row4=58.3%, row5=75%, row6=91.7%(GK)
const COL_X = { 1:12, 2:30, 3:50, 4:70, 5:88 };
const ROW_Y = { 1:8.3, 2:25, 3:41.7, 4:58.3, 5:75, 6:91.7 };

function Pitch({ fSlots, slots, openPlayer, onPlace, expertMode }) {
  const filledMap = {};
  slots.forEach(s => { filledMap[s.slotId] = s; });

  return (
    <div className="pitch-svg-wrap" style={{position:"relative", width:"100%", paddingBottom:"146.7%"}}>
      {/* SVG pitch markings */}
      <div style={{position:"absolute",inset:0}}>
        <svg viewBox="0 0 300 440" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",height:"100%",display:"block"}}>
          <defs>
            <pattern id="stripes" x="0" y="0" width="300" height="73.33" patternUnits="userSpaceOnUse">
              <rect width="300" height="36.67" fill="#0b1e0b"/>
              <rect y="36.67" width="300" height="36.66" fill="#0d230d"/>
            </pattern>
          </defs>
          <rect width="300" height="440" fill="url(#stripes)"/>
          {/* Pitch outline */}
          <rect x="16" y="6" width="268" height="428" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5"/>
          {/* Halfway line at y=220 */}
          <line x1="16" y1="220" x2="284" y2="220" stroke="rgba(255,255,255,0.14)" strokeWidth="1.2"/>
          {/* Centre circle */}
          <circle cx="150" cy="220" r="44" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1.2"/>
          <circle cx="150" cy="220" r="2.5" fill="rgba(255,255,255,0.22)"/>
          {/* Their goal (top) */}
          <rect x="117" y="0" width="66" height="8" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5"/>
          {/* Their 18yd box: y=6 to y=79 */}
          <rect x="65" y="6" width="170" height="73" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1.2"/>
          {/* Their 6yd box: y=6 to y=30 */}
          <rect x="111" y="6" width="78" height="24" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="1"/>
          {/* Their penalty spot */}
          <circle cx="150" cy="55" r="2.2" fill="rgba(255,255,255,0.2)"/>
          {/* Their penalty arc — curves DOWN into pitch from box bottom y=79 */}
          <clipPath id="topD">
            <rect x="0" y="79" width="300" height="361"/>
          </clipPath>
          <circle cx="150" cy="55" r="40.8" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" clipPath="url(#topD)"/>
          {/* Our goal (bottom) */}
          <rect x="117" y="432" width="66" height="8" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5"/>
          {/* Our 18yd box: y=361 to y=434 */}
          <rect x="65" y="361" width="170" height="73" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1.2"/>
          {/* Our 6yd box: y=410 to y=434 */}
          <rect x="111" y="410" width="78" height="24" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="1"/>
          {/* Our penalty spot */}
          <circle cx="150" cy="385" r="2.2" fill="rgba(255,255,255,0.2)"/>
          {/* Our penalty arc — curves UP into pitch from box top y=361 */}
          <clipPath id="botD">
            <rect x="0" y="0" width="300" height="361"/>
          </clipPath>
          <circle cx="150" cy="385" r="40.8" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" clipPath="url(#botD)"/>
          {/* Corner arcs */}
          <path d="M 16 18 A 12 12 0 0 1 28 6"    fill="none" stroke="rgba(255,255,255,0.09)" strokeWidth="1"/>
          <path d="M 272 6 A 12 12 0 0 1 284 18"   fill="none" stroke="rgba(255,255,255,0.09)" strokeWidth="1"/>
          <path d="M 16 422 A 12 12 0 0 0 28 434"  fill="none" stroke="rgba(255,255,255,0.09)" strokeWidth="1"/>
          <path d="M 272 434 A 12 12 0 0 0 284 422" fill="none" stroke="rgba(255,255,255,0.09)" strokeWidth="1"/>
        </svg>
      </div>

      {/* Player badges — absolutely positioned using COL_X / ROW_Y */}
      {fSlots.map((slot, i) => {
        const filled   = filledMap[slot.id];
        const isEmpty  = !filled;
        const isElig   = isEmpty && openPlayer && canFill(openPlayer.player.pos, slot.label);
        const xPct     = COL_X[slot.col] ?? 50;
        const yPct     = ROW_Y[slot.row] ?? 50;
        const badgeCls = filled ? "f" : `e${isElig ? " glow" : ""}${isEmpty ? " can" : ""}`;

        return (
          <div
            key={slot.id}
            className={`ps abs-badge${isElig ? " glow" : ""}${isEmpty ? " can" : ""}`}
            style={{
              position:"absolute",
              left:`${xPct}%`,
              top:`${yPct}%`,
              transform:"translate(-50%,-50%)",
              zIndex:2,
            }}
            onClick={isElig ? () => onPlace(slot) : undefined}
          >
            <div className={`badge ${badgeCls}`}>
              {filled ? (expertMode ? filled.player.pos : filled.player.rat) : slot.label}
            </div>
            {filled ? (
              <>
                <div className="sn fn">{filled.player.name.split(" ").slice(-1)[0]}</div>
                <div className="sp">{filled.player.pos}</div>
              </>
            ) : (
              <div className="sn">{slot.label}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}
