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
                ,['0120','012-Multiple-Use, Primarily Residential Secondary Use Open Space']
                ,['0130','013-Multiple-Use, Primarily Residential Secondary Use Commercial']
                ,['0140','014-Multiple-Use, Primarily Residential Secondary Use Industrial']
                ,['0160','016-Multiple-Use, Primarily Residential with Part of land designated under Chap 61 use']
                ,['0170','017-Multiple-Use, Primarily Residential with Part of land designated under Chap 61A use']
                ,['0180','018-Multiple-Use, Primarily Residential with Part of land designated under Chap 61B use']
                ,['0190','019-Multiple-Use, Primarily Residential Secondary Use Exempt']
                ,['0210','021-Multiple-Use, Primarily Open Space, A Single Family house with substantial acreage designated OS']
                ,['0230','023-Multiple-Use, Primarily Open Space Secondary Use Commercial']
                ,['0240','024-Multiple-Use, Primarily Open Space Secondary Use Industrial']
                ,['0290','029-Multiple-Use, Primarily Open Space Secondary Use Exempt']
                ,['0310','031-Multiple-Use, Primarily Commercial Secondary Use Residential']
                ,['0320','032-Multiple-Use, Primarily Commercial Secondary Use Open Space']
                ,['0340','034-Multiple-Use, Primarily Commercial Secondary Use Industrial']
                ,['0360','036-Multiple-Use, Primarily Commercial with Part of land designated under Chap 61 use']
                ,['0370','037-Multiple-Use, Primarily Commercial with Part of land designated under Chap 61A use']
                ,['0380','038-Multiple-Use, Primarily Commercial with Part of land designated under Chap 61B use']
                ,['0390','039-Multiple-Use, Primarily Commercial Secondary Use Exempt']
                ,['0410','041-Multiple-Use, Primarily Industrial Secondary Use Residential']
                ,['0420','042-Multiple-Use, Primarily Industrial Secondary Use Open Space']
                ,['0430','043-Multiple-Use, Primarily Industrial Secondary Use Commercial']
                ,['0490','049-Multiple-Use, Primarily Industrial Secondary Use Exempt']
                ,['1010','101-Single Family']
                ,['1020','102-Condominium']
                ,['1030','103-Mobile Home']
                ,['1040','104-Two Family']
                ,['1050','105-Three Family']
                ,['1060','106-Accessory Land With Improvement']
                ,['1070','107-Blank']
                ,['1080','108-Blank']
                ,['1090','109-Multiple House On One Parcel']
                ,['1110','111-Apartments - Four To Eight Units']
                ,['1120','112-Apartments - More Than Eight Units']
                ,['1210','121-Rooming &amp; Boarding Houses']
                ,['1220','122-Fraternity &amp; Sorority Houses']
                ,['1230','123-Residence Halls Or Dormitories']
                ,['1240','124-Rectories, Convents, Monasteries']
                ,['1250','125-Other Congregate Housing, Includes Non-Transient Shared Living Arrangements']
                ,['1300','130-Residential Developable Land']
                ,['1310','131-Residential Potentially Developable Land']
                ,['1320','132-Residential Undevelopable Land']
                ,['1400','140-Child Care Facility (M.G.L . Chapters 59 3F, 40A 9C) (See Also Code 352)']
                ,['2010','201-Residential Open Land']
                ,['2020','202-Under Water Land Or Marshes Not Under Public Ownership In Residential Areas']
                ,['2100','210-Non-Productive Agricultural Land not classified as Chapter 61 or Chapter 61A']
                ,['2110','211-Non-Productive Vacant Land']
                ,['2200','220-Commercial Vacant Land']
                ,['2210','221-Underwater Land Or Marshes Not Under Public Ownership In Commercially Zoned Area']
                ,['2300','230-Industrial Vacant Land']
                ,['2310','231-Underwater Land Or Marshes Not Under Public Ownership In Industrial Area']
                ,['2610','261-All Land Designated Under Chapter 61 Classified as Open Space']
                ,['2620','262-Christmas Trees - Chpt 61 Classified as Open Space']
                ,['2700','270-Cranberry Bog - Chpt 61A Classified as Open Space']
                ,['2710','271-Tobacco, Sod - Chpt 61A Classified as Open Space']
                ,['2720','272-Truck Crops - Vegetables - Chpt 61A Classified as Open Space']
                ,['2730','273-Field Crops - hay, wheat, tillable forage cropland etc. - Chpt 61A Classified as Open Space']
                ,['2740','274-Orchards - pears, apples, grape vineyards etc. - Chpt 61A Classified as Open Space']
                ,['2750','275-Christmas Trees - Chpt 61A Classified as Open Space']
                ,['2760','276-Necessary related land-farm roads, ponds, land under farm buildings - Chpt 61A Classified as Open Space']
                ,['2770','277-Productive Woodland - Christmas Trees, Woodlots - Chpt 61A Classified as Open Space']
                ,['2780','278-Pasture - Chpt 61A Classified as Open Space']
                ,['2790','279-Nurseries - Chpt 61A Classified as Open Space']
                ,['2800','280-Productive woodland - woodlots - Chpt 61B Classified as Open Space']
                ,['2810','281-Hiking - Camping and Nature Studies - Chpt 61B Classified as Open Space']
                ,['2820','282-Boating - Areas &amp; Supporting Land Facilities - Chpt 61B Classified as Open Space']
                ,['2830','283-Golfing - Areas Of Land Arranged As A Golf Course - Chpt 61B Classified as Open Space']
                ,['2840','284-Horseback Riding - Trails Or Areas - Chpt 61B Classified as Open Space']
                ,['2850','285-Hunting - Areas For The Hunting Of Wildlife - Chpt 61B Classified as Open Space']
                ,['2860','286-Alpine &amp; Nordic Skiing -  Chpt 61B Classified as Open Space']
                ,['2870','287-Swimming &amp; Picnicking Areas - Chpt 61B Classified as Open Space']
                ,['2880','288-Public Non-Commercial Flying - Areas For Gliding or Hand-Gliding - Chpt 61B Classified as Open Space']
                ,['2890','289-Target Shooting Areas such as Archery, Skeet or Approved Fire-Arms - Chpt 61B Classified as Open Space']
                ,['2900','290-Wet land, scrub land, rock land - Chpt 61A Classified as Open Space']
                ,['2920','292-Wet Land, Scrub Land, Rock Land - Chpt 61A Classified as Open Space']
                ,['3000','300-Hotels']
                ,['3010','301-Motels']
                ,['3020','302-Inns, Resorts Or Tourist Homes']
                ,['3030','303-Blank']
                ,['3040','304-Nursing Homes']
                ,['3050','305-Private Hospitals']
                ,['3060','306-Care &amp; Treatment Facilities']
                ,['3100','310-Tanks Holding Fuel &amp; Oil Products For Retail Distribution']
                ,['3110','311-Bottled Gas &amp; Propane Gas Tanks']
                ,['3120','312-Grain &amp; Feed Elevators']
                ,['3130','313-Lumber Yards']
                ,['3140','314-Trucking Terminals']
                ,['3150','315-Piers, Wharves, Docks &amp; Related Facilities That Are Used For Storage &amp; Transit Of Goods']
                ,['3160','316-Other Storage, Warehouse &amp; Distribution Facilities']
                ,['3170','317-Farm Buildings']
                ,['3180','318-Commercial Greenhouses']
                ,['3210','321-Facilities Providing Building Materials, Hardware &amp; Farm Equipment, Etc.']
                ,['3220','322-Discount Stores']
                ,['3230','323-Shopping Centers/Malls']
                ,['3240','324-Super Markets (In Excess Of 10,000 Sq. Ft)']
                ,['3250','325-Small Retail &amp; Services Stores (Under 10,000 Sq. Ft)']
                ,['3260','326-Eating &amp; Drinking Establishments-Restaurants, Diners, Fast Food, Bars, Night Clubs']
                ,['3300','330-Automotive Vehicles Sales &amp; Services']
                ,['3310','331-Automotive Supplies Sales &amp; Services']
                ,['3320','332-Auto Repair Facilities']
                ,['3330','333-Fuel Service Areas-Providing Only Fuel Products']
                ,['3340','334-Gasoline Service Stations-Providing Engine Repair Or Maintenance Services, &amp; Fuel Products']
                ,['3350','335-Car Wash Facilities']
                ,['3360','336-Parking Garages']
                ,['3370','337-Parking Lots - A Commercial Open Parking Lot For Motor Vehicles']
                ,['3380','338-Other Motor Vehicles Sales &amp; Services']
                ,['3400','340-General Office Buildings']
                ,['3410','341-Bank Buildings']
                ,['3420','342-Medical Office Buildings']
                ,['3430','343-Office Condominium']
                ,['3440','344-Intentionally Left Blank (Other Office Bldg)']
                ,['3450','345-Intentionally Left Blank (Other Office Bldg)']
                ,['3500','350-Property Used For Postal Services']
                ,['3510','351-Educational Properties']
                ,['3520','352-Day Care Centers, Adults']
                ,['3530','353-Fraternal Organizations']
                ,['3540','354-Bus Transportation Facilities &amp; Related Properties']
                ,['3550','355-Funeral Homes']
                ,['3560','356-Misc. Public Services']
                ,['3600','360-Museums']
                ,['3610','361-Art Galleries']
                ,['3620','362-Motion Picture Theaters']
                ,['3630','363-Drive-In Movies']
                ,['3640','364-Legitimate Theaters']
                ,['3650','365-Stadiums']
                ,['3660','366-Arenas &amp; Field Houses']
                ,['3670','367-Race Tracks']
                ,['3680','368-Fairgrounds &amp; Amusement Parks']
                ,['3690','369-Other Cultural &amp; Entertainment Properties']
                ,['3700','370-Bowling']
                ,['3710','371-Ice Skating']
                ,['3720','372-Roller Skating']
                ,['3730','373-Swimming Pools']
                ,['3740','374-Health Spas']
                ,['3750','375-Tennis And/Or Racquetball Clubs']
                ,['3760','376-Gymnasiums &amp; Athletic Clubs']
                ,['3770','377-Archery, Billiards, Other Indoor Facilities']
                ,['3780','378-Intentionally Left Blank (Indoor Recreational Facility)']
                ,['3800','380-Golf Courses']
                ,['3810','381-Tennis Courts']
                ,['3820','382-Riding Stables']
                ,['3830','383-Beaches Or Swimming Pools']
                ,['3840','384-Marinas']
                ,['3850','385-Fish &amp; Game Clubs']
                ,['3860','386-Camping Facilities']
                ,['3870','387-Summer Camps']
                ,['3880','388-Other Outdoor Facilities']
                ,['3890','389-Structures On Land Classified Under Chap 61B Recreational Land']
                ,['3900','390-Commercial Developable Land']
                ,['3910','391-Commercial Potentially Developable Land']
                ,['3920','392-Commercial Undevelopable Land']
                ,['3930','393-Agricultural/Horticultural Land Not Included In Chapter 61A']
                ,['4000','400-Buildings For Manufacturing Operations']
                ,['4010','401-Warehouse For Storage Of Manufactured Products']
                ,['4020','402-Office Building-Part of Manufacturing Operation']
                ,['4030','403-Land - Integral Part of Manufacturing Operation']
                ,['4040','404-Research &amp; Development Facilities']
                ,['4100','410-Sand &amp; Gravel']
                ,['4110','411-Gypsum']
                ,['4120','412-Rock']
                ,['4130','413-Other']
                ,['4200','420-Tanks']
                ,['4210','421-Liquid Natural Gas Tanks']
                ,['4230','423-Electric Transmission Right-Of-Way']
                ,['4240','424-Electricity Regulating Substations']
                ,['4250','425-Gas Production Plants']
                ,['4260','426-Gas Pipeline Right-Of-Way']
                ,['4270','427-Natural Or Manufactured Gas Storage']
                ,['4280','428-Gas Pressure Control Stations']
                ,['4290','429-Intentionally Left Blank (Utility)']
                ,['4300','430-Telephone Exchange Stations']
                ,['4310','431-Telephone Relay Towers']
                ,['4320','432-Cable TV Transmitting Facilities']
                ,['4330','433-Radio, Television Transmission Facilities']
                ,['4340','434-Intentionally Left Blank (Communication)']
                ,['4400','440-Industrial Developable Land']
                ,['4410','441-Industrial Potentially Developable Land']
                ,['4420','442-Industrial Undevelopable Land']
                ,['4430','443-Intentionally Left Blank']
                ,['4440','444-Intentionally Left Blank ']
                ,['4500','450-Electric Generation Plants']
                ,['4510','451-Electric Generation Plants, Transition Value']
                ,['4520','452-Electric Generation Plants, Agreement Value']
                ,['5010','501-Individuals, Partnerships, Associations &amp; Trusts']
                ,['5020','502-Domestic Business Corporations Or A Foreign Corporations, As Defined In Chap 63 &amp; 30']
                ,['5030','503-Domestic &amp; Foreign Corporations Classified Mnfg, As Defined In Chap 63 &amp; 38C &amp; 42B']
                ,['5040','504-Public Utilities - Transmission &amp; Distribution']
                ,['5050','505-Telephone &amp; Telegraph Machinery, Poles, Wires &amp; Underground Conduits Assessed by DOR']
                ,['5060','506-Pipelines Of 25 Miles Or More In Length For Transmitting Natural Gas Or Petroleum Assessed by DOR']
                ,['5080','508-Cellular/Mobile Wireless Telecommunications Companies']
                ,['5500','550-Electric Generation Plants Personal Property']
                ,['5510','551-Electric Generation Plant P.P Transition Value']
                ,['5520','552-Electric Generation P.P Agreement Value']
                ,['6010','601-All Land Designated Under Chapter 61']
                ,['6020','602-Christmas Trees - Under Chapter 61']
                ,['7100','710-Cranberry Bog Under Chapter 61A']
                ,['7110','711-Tobacco, Sod Under Chapter 61A']
                ,['7120','712-Truck Crops - Vegetables Under Chapter 61A']
                ,['7130','713-Field Crops - hay, wheat, tillable forage cropland etc. - Under Chapter 61A']
                ,['7140','714-Orchards - pears, apples, grape vineyards etc. - Under Chapter 61A']
                ,['7150','715-Christmas Trees - Under Chapter 61A']
                ,['7160','716-Necessary related land-farm roads, ponds, land under farm buildings - Under Chapter 61A']
                ,['7170','717-Productive Woodland - Christmas Trees, Woodlots Under Chapter 61A']
                ,['7180','718-Pasture Under Chapter 61A']
                ,['7190','719-Nurseries Under Chapter 61A']
                ,['7200','720-Wet land, scrub land, rock land - Under Chapter 61A']
                ,['7220','722-Wet Land, Scrub Land, Rock Land Under Chapter 61A']
                ,['8010','801-Hiking - Trails Or Paths Under Chapter 61B']
                ,['8020','802-Camping - Areas With Sites For Overnight Camping  Under Chapter 61B']
                ,['8030','803-Nature Study - Areas Specifically For Nature Study Or Observation  Under Chapter 61B']
                ,['8040','804-Boating - Areas For Recreational Boating &amp; Supporting Land Facilities  Under Chapter 61B']
                ,['8050','805-Golfing - Areas Of Land Arranged As A Golf Course  Under Chapter 61B']
                ,['8060','806-Horseback Riding - Trails Or Areas  Under Chapter 61B']
                ,['8070','807-Hunting - Areas For The Hunting Of Wildlife  Under Chapter 61B']
                ,['8080','808-Fishing Areas  Under Chapter 61B']
                ,['8090','809-Alpine Skiing - Areas For &quot;Downhill&quot; Skiing  Under Chapter 61B']
                ,['8100','810-Nordic Skiing - Areas For &quot;Cross-Country&quot; Skiing  Under Chapter 61B']
                ,['8110','811-Swimming Areas  Under Chapter 61B']
                ,['8120','812-Picnicking Areas  Under Chapter 61B']
                ,['8130','813-Public Non-Commercial Flying - Areas For Gliding Or Hand-Gliding  Under Chapter 61B']
                ,['8140','814-Target Shooting Areas Such As Archery, Skeet Or Approved Fire-Arms Under Chapter 61B']
                ,['8150','815-Productive Woodland - woodlots Under Chapter 61B']
                ,['9000','900-United States Government']
                ,['9010','901-Blank']
                ,['9020','902-Counties']
                ,['9030','903-Municipalities, Districts']
                ,['9040','904-Colleges, Schools (Private)']
                ,['9050','905-Charitable, Organizations (Private Hospitals, Etc.)']
                ,['9060','906-Churches, Synagogues &amp; Temples']
                ,['9070','907-121A Corporations']
                ,['9080','908-Housing Authority']
                ,['9100','910-Department Of Conservation &amp; Recreation, Division Of State Partks &amp; Recreation Reimbursable Land']
                ,['9110','911-Division Of Fisheries &amp; Wildlife, Dfw Environmental Law Enforcement Reimbursable Land']
                ,['9120','912-Department Of Corrections, Division Of Youth Services Reimbursable Land']
                ,['9130','913-Department Of Public Health, Soldiers Homes Reimbursable Land']
                ,['9140','914-Department Of Mental Health, Department Of Mental Retardation Reimbursable Land']
                ,['9150','915-Department Of Conservation &amp; Recreation, Division Of Water Supply Protection Reimbursable Land']
                ,['9160','916-Military Division - Campgrounds Reimbursable Land']
                ,['9170','917-Education - Univ. Of Mass, State Colleges, Community Colleges Reimbursable Land']
                ,['9180','918-Department Of Environmental Protection, Low-Level Radioactive Waste Management Board Reimbursable Land']
                ,['9190','919-Other Reimbursable Land']
                ,['9200','920-Department Of Conservation &amp; Recreation, Division Of Urban Parks &amp; Recreation Non-Reimbursable Land']
                ,['9210','921-Division Of Fisheries &amp; Wildlife, DFW Environmental Law Enforcement, Dept Of Env Protection Non-Reimbursable Land']
                ,['9220','922-Dept Of Corrections, Division Of Youth Services, Mass Military, State Police, Sheriffs Dept Non-Reimbursable Land']
                ,['9230','923-Dept Of Public Health, Soldiers Homes, Dept Of Mental Health, Dept Of Mental Retardation Non-Reimbursable Land']
                ,['9240','924-Mass Highway Dept Non-Reimbursable Land']
                ,['9250','925-Department Of Conservation &amp; Recreation, Division Of Water Supply Protection, Urban Parks Non-Reimbursable Land']
                ,['9260','926-Judiciary Non-Reimbursable Land']
                ,['9270','927-Education - Univ. Of Mass, State Colleges, Community Colleges Non-Reimbursable Land']
                ,['9280','928-Division Of Capital Asset Management, Bureau Of State Office Buildings Non-Reimbursable Land']
                ,['9290','929-Other Non-Reimbursable Land']
                ,['9300','930-Vacant, Selectmen Or City Council']
                ,['9310','931-Improved, Selectmen Or City Council']
                ,['9320','932-Vacant, Conservation']
                ,['9330','933-Vacant, Education']
                ,['9340','934-Improved, Education']
                ,['9350','935-Improved, Municipal Public Safety']
                ,['9360','936-Vacant, Tax Title/Treasurer']
                ,['9370','937-Improved, Tax Title/Treasurer']
                ,['9380','938-Vacant, District']
                ,['9390','939-Improved, District']
                ,['9400','940-Educational Private - Elementary Level']
                ,['9410','941-Educational Private - Secondary Level']
                ,['9420','942-Educational Private - College Or University']
                ,['9430','943-Educational Private - Other Educational ']
                ,['9440','944-Educational Private - Auxiliary Athletic']
                ,['9450','945-Educational Private - Affiliated Housing']
                ,['9460','946-Educational Private - Vacant ']
                ,['9470','947-Educational Private - Other  ']
                ,['9500','950-Charitable - Vacant, Conservation Organizations']
                ,['9510','951-Charitable - Other']
                ,['9520','952-Charitable - Auxiliary Use (Storage, Barns, Etc.)']
                ,['9530','953-Charitable - Cemeteries']
                ,['9540','954-Charitable - Function Halls, Community Centers, Fraternal Organizations']
                ,['9550','955-Charitable - Hospitals']
                ,['9560','956-Charitable - Libraries, Museums']
                ,['9570','957-Charitable Services']
                ,['9580','958-Charitable - Recreation, Active Use']
                ,['9590','959-Charitable - Housing, Other']
                ,['9600','960-Church, Mosque, Synagogue, Temple, Etc']
                ,['9610','961-Rectory Or Parsonage, Etc.']
                ,['9620','962-Other Religious Groups']
                ,['9630','963-Housing Authority']
                ,['9640','964-Utility Authority, Electric, Light, Sewer, Water']
                ,['9700','970-Housing Authority ']
                ,['9710','971-Utility Authority, Electric, Light, Sewer, Water']
                ,['9720','972-Transportation Authority']
                ,['9730','973-Vacant, Housing Authority']
                ,['9740','974-Vacant, Utility Authority']
                ,['9750','975-Vacant, Transportation Authority']
                ,['9800','980-Vacant, Selectmen Or City Council, Other City Or Town']
                ,['9810','981-Improved, Selectmen Or City Council, Other City Or Town']
                ,['9820','982-Vacant, Conservation, Other City Or Town']
                ,['9900','990-121A Corporations']
                ,['9910','991-Vacant, County Or Regional']
                ,['9920','992-Improved, County Or Regional, Deeds Or Administration']
                ,['9930','993-Improved Count Or Regional Correctional']
                ,['9940','994-Improved County Or Regional Association Commission']
                ,['9950','995-Other, Open Space']
                ,['9960','996-Other, Non-Taxable Condominium Common Land']
                ,['9970','997-Other']
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
