toolSettings.filter = {
   wmsLayerName : 'Tax Parcels'
  ,columns      : {
    'TOWN_ID' : {
       type     : 'multiSelect'
      ,label    : 'Town'
      ,required : true
      ,values   : [
         // 1st member of each pair = dbValue; 2nd member of each pair = displayValue
         ['*'  ,'ALL']
,['1','ABINGTON']
,['2','ACTON']
,['3','ACUSHNET']
,['4','ADAMS']
,['5','AGAWAM']
,['6','ALFORD']
,['7','AMESBURY']
,['8','AMHERST']
,['9','ANDOVER']
,['10','ARLINGTON']
,['11','ASHBURNHAM']
,['12','ASHBY']
,['13','ASHFIELD']
,['14','ASHLAND']
,['15','ATHOL']
,['16','ATTLEBORO']
,['17','AUBURN']
,['18','AVON']
,['19','AYER']
,['20','BARNSTABLE']
,['21','BARRE']
,['22','BECKET']
,['23','BEDFORD']
,['24','BELCHERTOWN']
,['25','BELLINGHAM']
,['26','BELMONT']
,['27','BERKLEY']
,['28','BERLIN']
,['29','BERNARDSTON']
,['30','BEVERLY']
,['31','BILLERICA']
,['32','BLACKSTONE']
,['33','BLANDFORD']
,['34','BOLTON']
,['35','BOSTON']
,['36','BOURNE']
,['37','BOXBOROUGH']
,['38','BOXFORD']
,['39','BOYLSTON']
,['40','BRAINTREE']
,['41','BREWSTER']
,['42','BRIDGEWATER']
,['43','BRIMFIELD']
,['44','BROCKTON']
,['45','BROOKFIELD']
,['46','BROOKLINE']
,['47','BUCKLAND']
,['48','BURLINGTON']
,['49','CAMBRIDGE']
,['50','CANTON']
,['51','CARLISLE']
,['52','CARVER']
,['53','CHARLEMONT']
,['54','CHARLTON']
,['55','CHATHAM']
,['56','CHELMSFORD']
,['57','CHELSEA']
,['58','CHESHIRE']
,['59','CHESTER']
,['60','CHESTERFIELD']
,['61','CHICOPEE']
,['62','CHILMARK']
,['63','CLARKSBURG']
,['64','CLINTON']
,['65','COHASSET']
,['66','COLRAIN']
,['67','CONCORD']
,['68','CONWAY']
,['69','CUMMINGTON']
,['70','DALTON']
,['71','DANVERS']
,['72','DARTMOUTH']
,['73','DEDHAM']
,['74','DEERFIELD']
,['75','DENNIS']
,['76','DIGHTON']
,['77','DOUGLAS']
,['78','DOVER']
,['79','DRACUT']
,['80','DUDLEY']
,['81','DUNSTABLE']
,['82','DUXBURY']
,['83','EAST BRIDGEWATER']
,['84','EAST BROOKFIELD']
,['85','EAST LONGMEADOW']
,['86','EASTHAM']
,['87','EASTHAMPTON']
,['88','EASTON']
,['89','EDGARTOWN']
,['90','EGREMONT']
,['91','ERVING']
,['92','ESSEX']
,['93','EVERETT']
,['94','FAIRHAVEN']
,['95','FALL RIVER']
,['96','FALMOUTH']
,['97','FITCHBURG']
,['98','FLORIDA']
,['99','FOXBOROUGH']
,['100','FRAMINGHAM']
,['101','FRANKLIN']
,['102','FREETOWN']
,['103','GARDNER']
,['104','AQUINNAH']
,['105','GEORGETOWN']
,['106','GILL']
,['107','GLOUCESTER']
,['108','GOSHEN']
,['109','GOSNOLD']
,['110','GRAFTON']
,['111','GRANBY']
,['112','GRANVILLE']
,['113','GREAT BARRINGTON']
,['114','GREENFIELD']
,['115','GROTON']
,['116','GROVELAND']
,['117','HADLEY']
,['118','HALIFAX']
,['119','HAMILTON']
,['120','HAMPDEN']
,['121','HANCOCK']
,['122','HANOVER']
,['123','HANSON']
,['124','HARDWICK']
,['125','HARVARD']
,['126','HARWICH']
,['127','HATFIELD']
,['128','HAVERHILL']
,['129','HAWLEY']
,['130','HEATH']
,['131','HINGHAM']
,['132','HINSDALE']
,['133','HOLBROOK']
,['134','HOLDEN']
,['135','HOLLAND']
,['136','HOLLISTON']
,['137','HOLYOKE']
,['138','HOPEDALE']
,['139','HOPKINTON']
,['140','HUBBARDSTON']
,['141','HUDSON']
,['142','HULL']
,['143','HUNTINGTON']
,['144','IPSWICH']
,['145','KINGSTON']
,['146','LAKEVILLE']
,['147','LANCASTER']
,['148','LANESBOROUGH']
,['149','LAWRENCE']
,['150','LEE']
,['151','LEICESTER']
,['152','LENOX']
,['153','LEOMINSTER']
,['154','LEVERETT']
,['155','LEXINGTON']
,['156','LEYDEN']
,['157','LINCOLN']
,['158','LITTLETON']
,['159','LONGMEADOW']
,['160','LOWELL']
,['161','LUDLOW']
,['162','LUNENBURG']
,['163','LYNN']
,['164','LYNNFIELD']
,['165','MALDEN']
,['166','MANCHESTER']
,['167','MANSFIELD']
,['168','MARBLEHEAD']
,['169','MARION']
,['170','MARLBOROUGH']
,['171','MARSHFIELD']
,['172','MASHPEE']
,['173','MATTAPOISETT']
,['174','MAYNARD']
,['175','MEDFIELD']
,['176','MEDFORD']
,['177','MEDWAY']
,['178','MELROSE']
,['179','MENDON']
,['180','MERRIMAC']
,['181','METHUEN']
,['182','MIDDLEBOROUGH']
,['183','MIDDLEFIELD']
,['184','MIDDLETON']
,['185','MILFORD']
,['186','MILLBURY']
,['187','MILLIS']
,['188','MILLVILLE']
,['189','MILTON']
,['190','MONROE']
,['191','MONSON']
,['192','MONTAGUE']
,['193','MONTEREY']
,['194','MONTGOMERY']
,['195','MOUNT WASHINGTON']
,['196','NAHANT']
,['197','NANTUCKET']
,['198','NATICK']
,['199','NEEDHAM']
,['200','NEW ASHFORD']
,['201','NEW BEDFORD']
,['202','NEW BRAINTREE']
,['203','NEW MARLBOROUGH']
,['204','NEW SALEM']
,['205','NEWBURY']
,['206','NEWBURYPORT']
,['207','NEWTON']
,['208','NORFOLK']
,['209','NORTH ADAMS']
,['210','NORTH ANDOVER']
,['211','NORTH ATTLEBOROUGH']
,['212','NORTH BROOKFIELD']
,['213','NORTH READING']
,['214','NORTHAMPTON']
,['215','NORTHBOROUGH']
,['216','NORTHBRIDGE']
,['217','NORTHFIELD']
,['218','NORTON']
,['219','NORWELL']
,['220','NORWOOD']
,['221','OAK BLUFFS']
,['222','OAKHAM']
,['223','ORANGE']
,['224','ORLEANS']
,['225','OTIS']
,['226','OXFORD']
,['227','PALMER']
,['228','PAXTON']
,['229','PEABODY']
,['230','PELHAM']
,['231','PEMBROKE']
,['232','PEPPERELL']
,['233','PERU']
,['234','PETERSHAM']
,['235','PHILLIPSTON']
,['236','PITTSFIELD']
,['237','PLAINFIELD']
,['238','PLAINVILLE']
,['239','PLYMOUTH']
,['240','PLYMPTON']
,['241','PRINCETON']
,['242','PROVINCETOWN']
,['243','QUINCY']
,['244','RANDOLPH']
,['245','RAYNHAM']
,['246','READING']
,['247','REHOBOTH']
,['248','REVERE']
,['249','RICHMOND']
,['250','ROCHESTER']
,['251','ROCKLAND']
,['252','ROCKPORT']
,['253','ROWE']
,['254','ROWLEY']
,['255','ROYALSTON']
,['256','RUSSELL']
,['257','RUTLAND']
,['258','SALEM']
,['259','SALISBURY']
,['260','SANDISFIELD']
,['261','SANDWICH']
,['262','SAUGUS']
,['263','SAVOY']
,['264','SCITUATE']
,['265','SEEKONK']
,['266','SHARON']
,['267','SHEFFIELD']
,['268','SHELBURNE']
,['269','SHERBORN']
,['270','SHIRLEY']
,['271','SHREWSBURY']
,['272','SHUTESBURY']
,['273','SOMERSET']
,['274','SOMERVILLE']
,['275','SOUTH HADLEY']
,['276','SOUTHAMPTON']
,['277','SOUTHBOROUGH']
,['278','SOUTHBRIDGE']
,['279','SOUTHWICK']
,['280','SPENCER']
,['281','SPRINGFIELD']
,['282','STERLING']
,['283','STOCKBRIDGE']
,['284','STONEHAM']
,['285','STOUGHTON']
,['286','STOW']
,['287','STURBRIDGE']
,['288','SUDBURY']
,['289','SUNDERLAND']
,['290','SUTTON']
,['291','SWAMPSCOTT']
,['292','SWANSEA']
,['293','TAUNTON']
,['294','TEMPLETON']
,['295','TEWKSBURY']
,['296','TISBURY']
,['297','TOLLAND']
,['298','TOPSFIELD']
,['299','TOWNSEND']
,['300','TRURO']
,['301','TYNGSBOROUGH']
,['302','TYRINGHAM']
,['303','UPTON']
,['304','UXBRIDGE']
,['305','WAKEFIELD']
,['306','WALES']
,['307','WALPOLE']
,['308','WALTHAM']
,['309','WARE']
,['310','WAREHAM']
,['311','WARREN']
,['312','WARWICK']
,['313','WASHINGTON']
,['314','WATERTOWN']
,['315','WAYLAND']
,['316','WEBSTER']
,['317','WELLESLEY']
,['318','WELLFLEET']
,['319','WENDELL']
,['320','WENHAM']
,['321','WEST BOYLSTON']
,['322','WEST BRIDGEWATER']
,['323','WEST BROOKFIELD']
,['324','WEST NEWBURY']
,['325','WEST SPRINGFIELD']
,['326','WEST STOCKBRIDGE']
,['327','WEST TISBURY']
,['328','WESTBOROUGH']
,['329','WESTFIELD']
,['330','WESTFORD']
,['331','WESTHAMPTON']
,['332','WESTMINSTER']
,['333','WESTON']
,['334','WESTPORT']
,['335','WESTWOOD']
,['336','WEYMOUTH']
,['337','WHATELY']
,['338','WHITMAN']
,['339','WILBRAHAM']
,['340','WILLIAMSBURG']
,['341','WILLIAMSTOWN']
,['342','WILMINGTON']
,['343','WINCHENDON']
,['344','WINCHESTER']
,['345','WINDSOR']
,['346','WINTHROP']
,['347','WOBURN']
,['348','WORCESTER']
,['349','WORTHINGTON']
,['350','WRENTHAM']
,['351','YARMOUTH']
      ]
    }
    ,'USE_CODE' : {
       type     : 'multiSelect'
      ,label    : 'Property type'
      ,required : true
      ,values   : [
         // 1st member of each pair = dbValue; 2nd member of each pair = displayValue
         ['*'  ,'ALL']
                ,['12','012-Multiple-Use, Primarily Residential Secondary Use Open Space']
                ,['13','013-Multiple-Use, Primarily Residential Secondary Use Commercial']
                ,['14','014-Multiple-Use, Primarily Residential Secondary Use Industrial']
                ,['16','016-Multiple-Use, Primarily Residential with Part of land designated under Chap 61 use']
                ,['17','017-Multiple-Use, Primarily Residential with Part of land designated under Chap 61A use']
                ,['18','018-Multiple-Use, Primarily Residential with Part of land designated under Chap 61B use']
                ,['19','019-Multiple-Use, Primarily Residential Secondary Use Exempt']
                ,['21','021-Multiple-Use, Primarily Open Space, A Single Family house with substantial acreage designated OS']
                ,['23','023-Multiple-Use, Primarily Open Space Secondary Use Commercial']
                ,['24','024-Multiple-Use, Primarily Open Space Secondary Use Industrial']
                ,['29','029-Multiple-Use, Primarily Open Space Secondary Use Exempt']
                ,['31','031-Multiple-Use, Primarily Commercial Secondary Use Residential']
                ,['32','032-Multiple-Use, Primarily Commercial Secondary Use Open Space']
                ,['34','034-Multiple-Use, Primarily Commercial Secondary Use Industrial']
                ,['36','036-Multiple-Use, Primarily Commercial with Part of land designated under Chap 61 use']
                ,['37','037-Multiple-Use, Primarily Commercial with Part of land designated under Chap 61A use']
                ,['38','038-Multiple-Use, Primarily Commercial with Part of land designated under Chap 61B use']
                ,['39','039-Multiple-Use, Primarily Commercial Secondary Use Exempt']
                ,['41','041-Multiple-Use, Primarily Industrial Secondary Use Residential']
                ,['42','042-Multiple-Use, Primarily Industrial Secondary Use Open Space']
                ,['43','043-Multiple-Use, Primarily Industrial Secondary Use Commercial']
                ,['49','049-Multiple-Use, Primarily Industrial Secondary Use Exempt']
                ,['101','101-Single Family']
                ,['102','102-Condominium']
                ,['103','103-Mobile Home']
                ,['104','104-Two Family']
                ,['105','105-Three Family']
                ,['106','106-Accessory Land With Improvement']
                ,['107','107-Blank']
                ,['108','108-Blank']
                ,['109','109-Multiple House On One Parcel']
                ,['111','111-Apartments - Four To Eight Units']
                ,['112','112-Apartments - More Than Eight Units']
                ,['121','121-Rooming &amp; Boarding Houses']
                ,['122','122-Fraternity &amp; Sorority Houses']
                ,['123','123-Residence Halls Or Dormitories']
                ,['124','124-Rectories, Convents, Monasteries']
                ,['125','125-Other Congregate Housing, Includes Non-Transient Shared Living Arrangements']
                ,['130','130-Residential Developable Land']
                ,['131','131-Residential Potentially Developable Land']
                ,['132','132-Residential Undevelopable Land']
                ,['140','140-Child Care Facility (M.G.L . Chapters 59 3F, 40A 9C) (See Also Code 352)']
                ,['201','201-Residential Open Land']
                ,['202','202-Under Water Land Or Marshes Not Under Public Ownership In Residential Areas']
                ,['210','210-Non-Productive Agricultural Land not classified as Chapter 61 or Chapter 61A']
                ,['211','211-Non-Productive Vacant Land']
                ,['220','220-Commercial Vacant Land']
                ,['221','221-Underwater Land Or Marshes Not Under Public Ownership In Commercially Zoned Area']
                ,['230','230-Industrial Vacant Land']
                ,['231','231-Underwater Land Or Marshes Not Under Public Ownership In Industrial Area']
                ,['261','261-All Land Designated Under Chapter 61 Classified as Open Space']
                ,['262','262-Christmas Trees - Chpt 61 Classified as Open Space']
                ,['270','270-Cranberry Bog - Chpt 61A Classified as Open Space']
                ,['271','271-Tobacco, Sod - Chpt 61A Classified as Open Space']
                ,['272','272-Truck Crops - Vegetables - Chpt 61A Classified as Open Space']
                ,['273','273-Field Crops - hay, wheat, tillable forage cropland etc. - Chpt 61A Classified as Open Space']
                ,['274','274-Orchards - pears, apples, grape vineyards etc. - Chpt 61A Classified as Open Space']
                ,['275','275-Christmas Trees - Chpt 61A Classified as Open Space']
                ,['276','276-Necessary related land-farm roads, ponds, land under farm buildings - Chpt 61A Classified as Open Space']
                ,['277','277-Productive Woodland - Christmas Trees, Woodlots - Chpt 61A Classified as Open Space']
                ,['278','278-Pasture - Chpt 61A Classified as Open Space']
                ,['279','279-Nurseries - Chpt 61A Classified as Open Space']
                ,['280','280-Productive woodland - woodlots - Chpt 61B Classified as Open Space']
                ,['281','281-Hiking - Camping and Nature Studies - Chpt 61B Classified as Open Space']
                ,['282','282-Boating - Areas &amp; Supporting Land Facilities - Chpt 61B Classified as Open Space']
                ,['283','283-Golfing - Areas Of Land Arranged As A Golf Course - Chpt 61B Classified as Open Space']
                ,['284','284-Horseback Riding - Trails Or Areas - Chpt 61B Classified as Open Space']
                ,['285','285-Hunting - Areas For The Hunting Of Wildlife - Chpt 61B Classified as Open Space']
                ,['286','286-Alpine &amp; Nordic Skiing -  Chpt 61B Classified as Open Space']
                ,['287','287-Swimming &amp; Picnicking Areas - Chpt 61B Classified as Open Space']
                ,['288','288-Public Non-Commercial Flying - Areas For Gliding or Hand-Gliding - Chpt 61B Classified as Open Space']
                ,['289','289-Target Shooting Areas such as Archery, Skeet or Approved Fire-Arms - Chpt 61B Classified as Open Space']
                ,['290','290-Wet land, scrub land, rock land - Chpt 61A Classified as Open Space']
                ,['292','292-Wet Land, Scrub Land, Rock Land - Chpt 61A Classified as Open Space']
                ,['300','300-Hotels']
                ,['301','301-Motels']
                ,['302','302-Inns, Resorts Or Tourist Homes']
                ,['303','303-Blank']
                ,['304','304-Nursing Homes']
                ,['305','305-Private Hospitals']
                ,['306','306-Care &amp; Treatment Facilities']
                ,['310','310-Tanks Holding Fuel &amp; Oil Products For Retail Distribution']
                ,['311','311-Bottled Gas &amp; Propane Gas Tanks']
                ,['312','312-Grain &amp; Feed Elevators']
                ,['313','313-Lumber Yards']
                ,['314','314-Trucking Terminals']
                ,['315','315-Piers, Wharves, Docks &amp; Related Facilities That Are Used For Storage &amp; Transit Of Goods']
                ,['316','316-Other Storage, Warehouse &amp; Distribution Facilities']
                ,['317','317-Farm Buildings']
                ,['318','318-Commercial Greenhouses']
                ,['321','321-Facilities Providing Building Materials, Hardware &amp; Farm Equipment, Etc.']
                ,['322','322-Discount Stores']
                ,['323','323-Shopping Centers/Malls']
                ,['324','324-Super Markets (In Excess Of 10,000 Sq. Ft)']
                ,['325','325-Small Retail &amp; Services Stores (Under 10,000 Sq. Ft)']
                ,['326','326-Eating &amp; Drinking Establishments-Restaurants, Diners, Fast Food, Bars, Night Clubs']
                ,['330','330-Automotive Vehicles Sales &amp; Services']
                ,['331','331-Automotive Supplies Sales &amp; Services']
                ,['332','332-Auto Repair Facilities']
                ,['333','333-Fuel Service Areas-Providing Only Fuel Products']
                ,['334','334-Gasoline Service Stations-Providing Engine Repair Or Maintenance Services, &amp; Fuel Products']
                ,['335','335-Car Wash Facilities']
                ,['336','336-Parking Garages']
                ,['337','337-Parking Lots - A Commercial Open Parking Lot For Motor Vehicles']
                ,['338','338-Other Motor Vehicles Sales &amp; Services']
                ,['340','340-General Office Buildings']
                ,['341','341-Bank Buildings']
                ,['342','342-Medical Office Buildings']
                ,['343','343-Office Condominium']
                ,['344','344-Intentionally Left Blank (Other Office Bldg)']
                ,['345','345-Intentionally Left Blank (Other Office Bldg)']
                ,['350','350-Property Used For Postal Services']
                ,['351','351-Educational Properties']
                ,['352','352-Day Care Centers, Adults']
                ,['353','353-Fraternal Organizations']
                ,['354','354-Bus Transportation Facilities &amp; Related Properties']
                ,['355','355-Funeral Homes']
                ,['356','356-Misc. Public Services']
                ,['360','360-Museums']
                ,['361','361-Art Galleries']
                ,['362','362-Motion Picture Theaters']
                ,['363','363-Drive-In Movies']
                ,['364','364-Legitimate Theaters']
                ,['365','365-Stadiums']
                ,['366','366-Arenas &amp; Field Houses']
                ,['367','367-Race Tracks']
                ,['368','368-Fairgrounds &amp; Amusement Parks']
                ,['369','369-Other Cultural &amp; Entertainment Properties']
                ,['370','370-Bowling']
                ,['371','371-Ice Skating']
                ,['372','372-Roller Skating']
                ,['373','373-Swimming Pools']
                ,['374','374-Health Spas']
                ,['375','375-Tennis And/Or Racquetball Clubs']
                ,['376','376-Gymnasiums &amp; Athletic Clubs']
                ,['377','377-Archery, Billiards, Other Indoor Facilities']
                ,['378','378-Intentionally Left Blank (Indoor Recreational Facility)']
                ,['380','380-Golf Courses']
                ,['381','381-Tennis Courts']
                ,['382','382-Riding Stables']
                ,['383','383-Beaches Or Swimming Pools']
                ,['384','384-Marinas']
                ,['385','385-Fish &amp; Game Clubs']
                ,['386','386-Camping Facilities']
                ,['387','387-Summer Camps']
                ,['388','388-Other Outdoor Facilities']
                ,['389','389-Structures On Land Classified Under Chap 61B Recreational Land']
                ,['390','390-Commercial Developable Land']
                ,['391','391-Commercial Potentially Developable Land']
                ,['392','392-Commercial Undevelopable Land']
                ,['393','393-Agricultural/Horticultural Land Not Included In Chapter 61A']
                ,['400','400-Buildings For Manufacturing Operations']
                ,['401','401-Warehouse For Storage Of Manufactured Products']
                ,['402','402-Office Building-Part of Manufacturing Operation']
                ,['403','403-Land - Integral Part of Manufacturing Operation']
                ,['404','404-Research &amp; Development Facilities']
                ,['410','410-Sand &amp; Gravel']
                ,['411','411-Gypsum']
                ,['412','412-Rock']
                ,['413','413-Other']
                ,['420','420-Tanks']
                ,['421','421-Liquid Natural Gas Tanks']
                ,['423','423-Electric Transmission Right-Of-Way']
                ,['424','424-Electricity Regulating Substations']
                ,['425','425-Gas Production Plants']
                ,['426','426-Gas Pipeline Right-Of-Way']
                ,['427','427-Natural Or Manufactured Gas Storage']
                ,['428','428-Gas Pressure Control Stations']
                ,['429','429-Intentionally Left Blank (Utility)']
                ,['430','430-Telephone Exchange Stations']
                ,['431','431-Telephone Relay Towers']
                ,['432','432-Cable TV Transmitting Facilities']
                ,['433','433-Radio, Television Transmission Facilities']
                ,['434','434-Intentionally Left Blank (Communication)']
                ,['440','440-Industrial Developable Land']
                ,['441','441-Industrial Potentially Developable Land']
                ,['442','442-Industrial Undevelopable Land']
                ,['443','443-Intentionally Left Blank']
                ,['444','444-Intentionally Left Blank ']
                ,['450','450-Electric Generation Plants']
                ,['451','451-Electric Generation Plants, Transition Value']
                ,['452','452-Electric Generation Plants, Agreement Value']
                ,['501','501-Individuals, Partnerships, Associations &amp; Trusts']
                ,['502','502-Domestic Business Corporations Or A Foreign Corporations, As Defined In Chap 63 &amp; 30']
                ,['503','503-Domestic &amp; Foreign Corporations Classified Mnfg, As Defined In Chap 63 &amp; 38C &amp; 42B']
                ,['504','504-Public Utilities - Transmission &amp; Distribution']
                ,['505','505-Telephone &amp; Telegraph Machinery, Poles, Wires &amp; Underground Conduits Assessed by DOR']
                ,['506','506-Pipelines Of 25 Miles Or More In Length For Transmitting Natural Gas Or Petroleum Assessed by DOR']
                ,['508','508-Cellular/Mobile Wireless Telecommunications Companies']
                ,['550','550-Electric Generation Plants Personal Property']
                ,['551','551-Electric Generation Plant P.P Transition Value']
                ,['552','552-Electric Generation P.P Agreement Value']
                ,['601','601-All Land Designated Under Chapter 61']
                ,['602','602-Christmas Trees - Under Chapter 61']
                ,['710','710-Cranberry Bog Under Chapter 61A']
                ,['711','711-Tobacco, Sod Under Chapter 61A']
                ,['712','712-Truck Crops - Vegetables Under Chapter 61A']
                ,['713','713-Field Crops - hay, wheat, tillable forage cropland etc. - Under Chapter 61A']
                ,['714','714-Orchards - pears, apples, grape vineyards etc. - Under Chapter 61A']
                ,['715','715-Christmas Trees - Under Chapter 61A']
                ,['716','716-Necessary related land-farm roads, ponds, land under farm buildings - Under Chapter 61A']
                ,['717','717-Productive Woodland - Christmas Trees, Woodlots Under Chapter 61A']
                ,['718','718-Pasture Under Chapter 61A']
                ,['719','719-Nurseries Under Chapter 61A']
                ,['720','720-Wet land, scrub land, rock land - Under Chapter 61A']
                ,['722','722-Wet Land, Scrub Land, Rock Land Under Chapter 61A']
                ,['801','801-Hiking - Trails Or Paths Under Chapter 61B']
                ,['802','802-Camping - Areas With Sites For Overnight Camping  Under Chapter 61B']
                ,['803','803-Nature Study - Areas Specifically For Nature Study Or Observation  Under Chapter 61B']
                ,['804','804-Boating - Areas For Recreational Boating &amp; Supporting Land Facilities  Under Chapter 61B']
                ,['805','805-Golfing - Areas Of Land Arranged As A Golf Course  Under Chapter 61B']
                ,['806','806-Horseback Riding - Trails Or Areas  Under Chapter 61B']
                ,['807','807-Hunting - Areas For The Hunting Of Wildlife  Under Chapter 61B']
                ,['808','808-Fishing Areas  Under Chapter 61B']
                ,['809','809-Alpine Skiing - Areas For &quot;Downhill&quot; Skiing  Under Chapter 61B']
                ,['810','810-Nordic Skiing - Areas For &quot;Cross-Country&quot; Skiing  Under Chapter 61B']
                ,['811','811-Swimming Areas  Under Chapter 61B']
                ,['812','812-Picnicking Areas  Under Chapter 61B']
                ,['813','813-Public Non-Commercial Flying - Areas For Gliding Or Hand-Gliding  Under Chapter 61B']
                ,['814','814-Target Shooting Areas Such As Archery, Skeet Or Approved Fire-Arms Under Chapter 61B']
                ,['815','815-Productive Woodland - woodlots Under Chapter 61B']
                ,['900','900-United States Government']
                ,['901','901-Blank']
                ,['902','902-Counties']
                ,['903','903-Municipalities, Districts']
                ,['904','904-Colleges, Schools (Private)']
                ,['905','905-Charitable, Organizations (Private Hospitals, Etc.)']
                ,['906','906-Churches, Synagogues &amp; Temples']
                ,['907','907-121A Corporations']
                ,['908','908-Housing Authority']
                ,['910','910-Department Of Conservation &amp; Recreation, Division Of State Partks &amp; Recreation Reimbursable Land']
                ,['911','911-Division Of Fisheries &amp; Wildlife, Dfw Environmental Law Enforcement Reimbursable Land']
                ,['912','912-Department Of Corrections, Division Of Youth Services Reimbursable Land']
                ,['913','913-Department Of Public Health, Soldiers Homes Reimbursable Land']
                ,['914','914-Department Of Mental Health, Department Of Mental Retardation Reimbursable Land']
                ,['915','915-Department Of Conservation &amp; Recreation, Division Of Water Supply Protection Reimbursable Land']
                ,['916','916-Military Division - Campgrounds Reimbursable Land']
                ,['917','917-Education - Univ. Of Mass, State Colleges, Community Colleges Reimbursable Land']
                ,['918','918-Department Of Environmental Protection, Low-Level Radioactive Waste Management Board Reimbursable Land']
                ,['919','919-Other Reimbursable Land']
                ,['920','920-Department Of Conservation &amp; Recreation, Division Of Urban Parks &amp; Recreation Non-Reimbursable Land']
                ,['921','921-Division Of Fisheries &amp; Wildlife, DFW Environmental Law Enforcement, Dept Of Env Protection Non-Reimbursable Land']
                ,['922','922-Dept Of Corrections, Division Of Youth Services, Mass Military, State Police, Sheriffs Dept Non-Reimbursable Land']
                ,['923','923-Dept Of Public Health, Soldiers Homes, Dept Of Mental Health, Dept Of Mental Retardation Non-Reimbursable Land']
                ,['924','924-Mass Highway Dept Non-Reimbursable Land']
                ,['925','925-Department Of Conservation &amp; Recreation, Division Of Water Supply Protection, Urban Parks Non-Reimbursable Land']
                ,['926','926-Judiciary Non-Reimbursable Land']
                ,['927','927-Education - Univ. Of Mass, State Colleges, Community Colleges Non-Reimbursable Land']
                ,['928','928-Division Of Capital Asset Management, Bureau Of State Office Buildings Non-Reimbursable Land']
                ,['929','929-Other Non-Reimbursable Land']
                ,['930','930-Vacant, Selectmen Or City Council']
                ,['931','931-Improved, Selectmen Or City Council']
                ,['932','932-Vacant, Conservation']
                ,['933','933-Vacant, Education']
                ,['934','934-Improved, Education']
                ,['935','935-Improved, Municipal Public Safety']
                ,['936','936-Vacant, Tax Title/Treasurer']
                ,['937','937-Improved, Tax Title/Treasurer']
                ,['938','938-Vacant, District']
                ,['939','939-Improved, District']
                ,['940','940-Educational Private - Elementary Level']
                ,['941','941-Educational Private - Secondary Level']
                ,['942','942-Educational Private - College Or University']
                ,['943','943-Educational Private - Other Educational ']
                ,['944','944-Educational Private - Auxiliary Athletic']
                ,['945','945-Educational Private - Affiliated Housing']
                ,['946','946-Educational Private - Vacant ']
                ,['947','947-Educational Private - Other  ']
                ,['950','950-Charitable - Vacant, Conservation Organizations']
                ,['951','951-Charitable - Other']
                ,['952','952-Charitable - Auxiliary Use (Storage, Barns, Etc.)']
                ,['953','953-Charitable - Cemeteries']
                ,['954','954-Charitable - Function Halls, Community Centers, Fraternal Organizations']
                ,['955','955-Charitable - Hospitals']
                ,['956','956-Charitable - Libraries, Museums']
                ,['957','957-Charitable Services']
                ,['958','958-Charitable - Recreation, Active Use']
                ,['959','959-Charitable - Housing, Other']
                ,['960','960-Church, Mosque, Synagogue, Temple, Etc']
                ,['961','961-Rectory Or Parsonage, Etc.']
                ,['962','962-Other Religious Groups']
                ,['963','963-Housing Authority']
                ,['964','964-Utility Authority, Electric, Light, Sewer, Water']
                ,['970','970-Housing Authority ']
                ,['971','971-Utility Authority, Electric, Light, Sewer, Water']
                ,['972','972-Transportation Authority']
                ,['973','973-Vacant, Housing Authority']
                ,['974','974-Vacant, Utility Authority']
                ,['975','975-Vacant, Transportation Authority']
                ,['980','980-Vacant, Selectmen Or City Council, Other City Or Town']
                ,['981','981-Improved, Selectmen Or City Council, Other City Or Town']
                ,['982','982-Vacant, Conservation, Other City Or Town']
                ,['990','990-121A Corporations']
                ,['991','991-Vacant, County Or Regional']
                ,['992','992-Improved, County Or Regional, Deeds Or Administration']
                ,['993','993-Improved Count Or Regional Correctional']
                ,['994','994-Improved County Or Regional Association Commission']
                ,['995','995-Other, Open Space']
                ,['996','996-Other, Non-Taxable Condominium Common Land']
                ,['997','997-Other']
      ]
    }
    ,'TOTAL_VAL' : {
       type     : 'number'
      ,label    : 'Total value ($)'
      ,required : false
/*
      ,values   : [
         0
        ,9999999999
      ]
*/
    }
    ,'LS_DATE' : {
       type     : 'number'
      ,label    : 'Last sale date (YYYYMMDD)'
      ,required : false
/*      ,values   : [
         // 1st record = min; 2nd record = max
         20010101
        ,20121231
      ]
*/
    }
    ,'LS_PRICE' : {
       type     : 'number'
      ,label    : 'Last sale price ($)'
      ,required : false
/*
      ,values   : [
         0
        ,9999999999
      ]
*/
    }
    ,'LOT_SIZE' : {
       type     : 'number'
      ,label    : 'Lot size (acres)'
      ,required : false
/*
      ,values   : [
         0
        ,9999999999
      ]
*/
    }
    ,'BLDG_VAL' : {
       type     : 'number'
      ,label    : 'Building value($)'
      ,required : false
/*
      ,values   : [
         0
        ,9999999999
      ]
*/
    }



  }
  ,display : {
     labelWidth       : 150
    ,multiSelectWidth : 500 
    ,winWidth         : 700
    ,winHeight        : 530
  }
  ,button : {
     icon    : 'img/filter.png'
    ,scale   : 'medium'
    ,tooltip : 'Create a custom layer filter'
    ,handler :  function() {
      function renderTip(val,metadata,rec) {
        metadata.attr = 'ext:qtip="' + val + '"';
        return val;
      }

      var win = Ext.getCmp('filterBuilder');
      if (win && !win.hidden) {
        win.hide();
      }

      var parser = new OpenLayers.Format.Filter.v1_1_0();
      var xml    = new OpenLayers.Format.XML();

      var lyr       = map.getLayersByName(toolSettings.filter.wmsLayerName)[0];
      var defaults  = {};
      if (lyr) {
        var xmlFilter = OpenLayers.Util.getParameters(lyr.getFullRequestString({}))['FILTER'];
        if (xmlFilter) {
          var f = xml.read(xmlFilter);
          var between = getElementsByTagNameNS(f,'http://www.opengis.net/ogc','ogc','PropertyIsBetween');
          for (var i = 0; i < between.length; i++) {
            defaults[OpenLayers.Util.getXmlNodeValue(
              getElementsByTagNameNS(between[i],'http://www.opengis.net/ogc','ogc','PropertyName')[0]
            )] = {
              min : OpenLayers.Util.getXmlNodeValue(
                getElementsByTagNameNS(
                   getElementsByTagNameNS(between[i],'http://www.opengis.net/ogc','ogc','LowerBoundary')[0]
                  ,'http://www.opengis.net/ogc'
                  ,'ogc'
                  ,'Literal'
                )[0]
              )
              ,max : OpenLayers.Util.getXmlNodeValue(
                getElementsByTagNameNS(
                   getElementsByTagNameNS(between[i],'http://www.opengis.net/ogc','ogc','UpperBoundary')[0]
                  ,'http://www.opengis.net/ogc'
                  ,'ogc'
                  ,'Literal'
                )[0]
              )
            };
          }
          var equalTo = getElementsByTagNameNS(f,'http://www.opengis.net/ogc','ogc','PropertyIsEqualTo');
          for (var i = 0; i < equalTo.length; i++) {
            if (!defaults[OpenLayers.Util.getXmlNodeValue(getElementsByTagNameNS(equalTo[i],'http://www.opengis.net/ogc','ogc','PropertyName')[0])]) {
              defaults[OpenLayers.Util.getXmlNodeValue(getElementsByTagNameNS(equalTo[i],'http://www.opengis.net/ogc','ogc','PropertyName')[0])] = {};
            }
            defaults[OpenLayers.Util.getXmlNodeValue(getElementsByTagNameNS(equalTo[i],'http://www.opengis.net/ogc','ogc','PropertyName')[0])][OpenLayers.Util.getXmlNodeValue(getElementsByTagNameNS(equalTo[i],'http://www.opengis.net/ogc','ogc','Literal')[0])] = true;
          }
        }
      }

      var items = [{
         border : false
        ,html   : 'Complete the fields below to affect change in the ' + toolSettings.filter.wmsLayerName + ' layer. An asterisk (*) indicates a required field or a pair of required fields.<br>&nbsp;<br>'
      }];
      for (var c in toolSettings.filter.columns) {
        if (toolSettings.filter.columns[c].type == 'number') {
          items.push({
             border    : false
            ,layout    : 'column'
            ,defaults  : {border : false}
            ,bodyStyle : 'padding-bottom:4px'
            ,items : [
              {
                 width       : toolSettings.filter.display.labelWidth
                ,html        : toolSettings.filter.columns[c].label + (toolSettings.filter.columns[c].required ? '*' : '') + ':'
                ,cls         : 'x-form-item'
              }
              ,{
                 width       : 60
                ,html        : 'between'
                ,cls         : 'x-form-item'
              }
              ,new Ext.form.NumberField({
                 name       : c + '.min'
                ,id         : c + '.min'
                ,cls        : 'numberField'
                ,allowBlank : !toolSettings.filter.columns[c].required
                ,width      : 100
                ,minValue   : (toolSettings.filter.columns[c].values && toolSettings.filter.columns[c].values.length == 2 ? toolSettings.filter.columns[c].values[0] : Number.NEGATIVE_INFINITY)
                ,maxValue   : (toolSettings.filter.columns[c].values && toolSettings.filter.columns[c].values.length == 2 ? toolSettings.filter.columns[c].values[1] : Number.MAX_VALUE)
                ,listeners  : {afterrender : function(el) {
                  if (defaults[el.id.replace(/.min$/,'')]) {
                    el.setValue(defaults[el.id.replace(/.min$/,'')].min);
                  }
                  else if (toolSettings.filter.columns[el.id.replace(/.min$/,'')].required) {
                    el.setValue(toolSettings.filter.columns[el.id.replace(/.min$/,'')].values && toolSettings.filter.columns[el.id.replace(/.min$/,'')].values.length == 2 ? toolSettings.filter.columns[el.id.replace(/.min$/,'')].values[0] : Number.NEGATIVE_INFINITY);
                  }
                  win.resetItems.push({
                     id  : el.id
                    ,typ : 'number'
                    ,val : el.getValue()
                  });
                }}
              })
              ,{
                 width       : 35
                ,html        : '&nbsp;&nbsp;and'
                ,cls         : 'x-form-item'
              }
              ,new Ext.form.NumberField({
                 name       : c + '.max'
                ,id         : c + '.max'
                ,cls        : 'numberField'
                ,allowBlank : !toolSettings.filter.columns[c].required
                ,width      : 100
                ,minValue   : (toolSettings.filter.columns[c].values && toolSettings.filter.columns[c].values.length == 2 ? toolSettings.filter.columns[c].values[0] : Number.NEGATIVE_INFINITY)
                ,maxValue   : (toolSettings.filter.columns[c].values && toolSettings.filter.columns[c].values.length == 2 ? toolSettings.filter.columns[c].values[1] : Number.MAX_VALUE)
                ,listeners  : {afterrender : function(el) {
                  if (defaults[el.id.replace(/.max$/,'')]) {
                    el.setValue(defaults[el.id.replace(/.max$/,'')].max);
                  }
                  else if (toolSettings.filter.columns[el.id.replace(/.max$/,'')].required) {
                    el.setValue(toolSettings.filter.columns[el.id.replace(/.max$/,'')].values && toolSettings.filter.columns[el.id.replace(/.max$/,'')].values.length == 2 ? toolSettings.filter.columns[el.id.replace(/.max$/,'')].values[1] : Number.MAX_VALUE);
                  }
                  win.resetItems.push({
                     id  : el.id
                    ,typ : 'number'
                    ,val : el.getValue()
                  });
                }}
              })
            ]
          });
        }
        else if (toolSettings.filter.columns[c].type == 'radioButtons') {
          var cbItems = [];
          var defaultValue;
          for (var i = 0; i < toolSettings.filter.columns[c].values.length; i++) {
            var checked = defaults[c] ? defaults[c][toolSettings.filter.columns[c].values[i][0]] : toolSettings.filter.columns[c].values[i][0] == '*';
            var id = c + i;
            cbItems.push({
               name       : c
              ,boxLabel   : toolSettings.filter.columns[c].values[i][1]
              ,inputValue : toolSettings.filter.columns[c].values[i][0]
              ,id         : id
              ,checked    : checked
            });
            if (checked) {
              defaultValue = id;
            }
          }
          items.push(new Ext.form.RadioGroup({
             fieldLabel       : toolSettings.filter.columns[c].label + (toolSettings.filter.columns[c].required ? '*' : '')
            ,allowBlank       : !toolSettings.filter.columns[c].required
            ,columns          : 1
            ,id               : c
            ,items            : cbItems
            ,defaultValue     : defaultValue
            ,listeners        : {afterrender : function(el) {
              win.resetItems.push({
                 id  : el.defaultValue
                ,typ : 'radio'
                ,val : true
              });
            }}
          }));
        }
        else if (toolSettings.filter.columns[c].type == 'multiSelect') {
          items.push({html : '<img src="img/blank.png" height=3>',border : false});
          items.push(new Ext.grid.GridPanel({
             id               : c
            ,fieldLabel       : toolSettings.filter.columns[c].label + (toolSettings.filter.columns[c].required ? '*' : '')
            ,width            : toolSettings.filter.display.multiSelectWidth
            ,height           : 100
            ,autoExpandColumn : 'lbl'
            ,enableHdMenu     : false
            ,hideHeaders      : true
            ,columns          : [{id : 'lbl',dataIndex : 'lbl',renderer : renderTip}]
            ,store          : new Ext.data.ArrayStore({
               fields : ['val','lbl']
              ,data   : toolSettings.filter.columns[c].values
            })
            ,listeners        : {viewready : function(gp) {
              var rows = [];
              if (defaults[gp.id]) {
                var i = 0;
                gp.getStore().each(function(rec) {
                  if (defaults[gp.id][rec.get('val')]) {
                    rows.push(i);
                  }
                  i++;
                });
              }
              if (rows.length == 0) {
                gp.getSelectionModel().selectFirstRow();
              }
              else {
                gp.getSelectionModel().selectRows(rows);
              }
              win.resetItems.push({
                 id  : gp.id
                ,typ : 'grid'
                ,val : rows
              });
            }}
          }));
          items.push({html : '<img src="img/blank.png" height=3>',border : false});
        }
      }
      win = new Ext.Window({
         title    : toolSettings.filter.wmsLayerName + ' Filter Builder'
        ,id       : 'filterBuilder'
        ,width    : toolSettings.filter.display.winWidth
        ,height   : toolSettings.filter.display.winHeight
        ,defaults : {border : false}
        ,layout   : 'fit'
        ,constrainHeader : true
        ,resetItems : []
        ,items    : new Ext.FormPanel({
           bodyStyle    : 'padding:6px;border-bottom: 1px solid #99BBE8'
          ,monitorValid : true
          ,labelWidth   : toolSettings.filter.display.labelWidth
          ,items        : items 
          ,buttons      : [
            {
               text    : 'Cancel'
              ,handler : function() {
                win.hide();
              }
            }
            ,{
               text    : 'Reset'
              ,handler : function() {
                for (var i = 0; i < map.filterResetItems.length; i++) {
                  if (map.filterResetItems[i].typ == 'number' || map.filterResetItems[i].typ == 'radio') {
                    Ext.getCmp(map.filterResetItems[i].id).setValue(map.filterResetItems[i].val);
                  }
                  else if (map.filterResetItems[i].typ == 'grid') {
                    if (map.filterResetItems[i].val.length == 0) {
                      Ext.getCmp(map.filterResetItems[i].id).getSelectionModel().selectFirstRow();
                    }
                    else {
                      Ext.getCmp(map.filterResetItems[i].id).getSelectionModel().selectRows(map.filterResetItems[i].val);
                    }
                  }
                }
              }
            }
            ,{
               text     : 'Apply'
              ,formBind : true
              ,handler  : function() {
                var f = [];
                for (var c in toolSettings.filter.columns) {
                  if (toolSettings.filter.columns[c].type == 'number') {
                    if (typeof Ext.getCmp(c + '.min').getValue() == 'number' && typeof Ext.getCmp(c + '.max').getValue() == 'number') {
                      f.push(new OpenLayers.Filter.Comparison({
                         type          : OpenLayers.Filter.Comparison.BETWEEN
                        ,property      : c
                        ,lowerBoundary : Ext.getCmp(c + '.min').getValue()
                        ,upperBoundary : Ext.getCmp(c + '.max').getValue()
                      }));
                    }
                  }
                  else if (toolSettings.filter.columns[c].type == 'radioButtons') {
                    if (Ext.getCmp(c).items.get(0).getGroupValue() != '*') {
                      f.push(new OpenLayers.Filter.Comparison({
                         type     : OpenLayers.Filter.Comparison.EQUAL_TO
                        ,property : c
                        ,value    : Ext.getCmp(c).items.get(0).getGroupValue()
                      }));
                    }
                  }
                  else if (toolSettings.filter.columns[c].type == 'multiSelect') {
                    var p = [];
                    var s = Ext.getCmp(c).getSelectionModel().getSelections();
                    var allSelected = false;
                    for (var i = 0; i < s.length; i++) {
                      allSelected = allSelected || s[i].get('val') == '*';
                    } 
                    if (!allSelected) {
                      for (var i = 0; i < s.length; i++) {
                        p.push(new OpenLayers.Filter.Comparison({
                           type     : OpenLayers.Filter.Comparison.EQUAL_TO
                          ,property : c
                          ,value    : s[i].get('val')
                        }));
                      }
                      if (s.length > 1) {
                        f.push(new OpenLayers.Filter.Logical({
                           type    : OpenLayers.Filter.Logical.OR
                          ,filters : p
                        }));
                      }
                      else {
                        f.push(p[0]);
                      }
                    }
                  }
                }

                f.unshift(new OpenLayers.Filter.Spatial({
                   type     : OpenLayers.Filter.Spatial.INTERSECTS
                  ,property : lyr2shp[toolSettings.filter.wmsLayerName] == 'true' ? 'the_geom' : 'SHAPE'
                  ,value    : map.getExtent().toGeometry()
                }));

                if (f.length > 1) {
                  f = [
                    new OpenLayers.Filter.Logical({
                       type    : OpenLayers.Filter.Logical.AND
                      ,filters : f
                    })
                  ]; 
                }

                addLayer(lyr2wms[toolSettings.filter.wmsLayerName],lyr2proj[toolSettings.filter.wmsLayerName],toolSettings.filter.wmsLayerName,true,1,wmsUrl);
                map.getLayersByName(toolSettings.filter.wmsLayerName)[0].mergeNewParams({FILTER : xml.write(parser.write(f[0])).replace('<gml:Polygon xmlns:gml="http://www.opengis.net/gml">','<gml:Polygon xmlns:gml="http://www.opengis.net/gml" srsName="' + map.getProjectionObject() + '">')});
                Ext.getCmp('queryBox').toggle(true);
                runQueryStats(map.getExtent().toGeometry(),map.getLayersByName(toolSettings.filter.wmsLayerName)[0]);
              }
            }
          ]
        })
        ,listeners : {
           hide        : function(win) {win.destroy()}
          ,afterrender : function(win) {
            if (!map.filterResetItems) {
              map.filterResetItems = win.resetItems;
            }
          }
        }
      });
      win.show();
    }
  }
};
