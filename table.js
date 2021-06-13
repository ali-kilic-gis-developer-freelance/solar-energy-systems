
Vue.component('solar', {
	data:function(){
		return this.setDefault();
  },
    methods:{
        setDefault:function(){
            return {
                onoff:false,
                lat:32.28,
                lng:106.75,
                date:'2013-11-14',
                time:'14:34',
                utc:{selected:'-7',data:['-11','-10','-9','-8','-7','-6','-5','-4','-3','-2','-1','0','+1','+2','+3','+4','+5','+6','+7','+8','+9','+10','+11','+12']},
                collector_azimuth_angle:0,
                collector_tilt_angle:32.28,
                reflectance_of_surface:0.200,
                collector_length:59.06,
                collector_width:38.98,
                collector_current:8.09,
                collector_voltage:26.6,
                collector_power:215,
                obj:{
                  decimal_time:0,
                  jday:0,
                  longitude_correction:0,
                  equation_of_time:0,
                  solar_time:0,
                  local_time:0,
                  hours_before:0,
                  after_noon:0,
                  solar_declination:0,
                  solar_altitude:0,
                  collector_tilt_angle:0,
                  air_mass_ratio:0,
                  solar_hour_angle:0,
                  local_solar_altitude:0,
                  solar_azimuth_angle:0,
                  local_collector_tilt_angle:0,
                  local_air_mass_ratio:0,
                  sunrise_hour_angle:0,
                  sunrise_before_noon:0,
                  sunrise_geo_solar_time:0,
                  sunrise_geo_local_time:0,
                  sunrise_adjustment_factor:0,
                  sunrise_con_solar_time:0,
                  sunrise_con_local_time:0,
                  sunset_hour_angle:0,
                  sunset_after_noon:0,
                  sunset_geo_solar_time:0,
                  sunset_geo_local_time:0,
                  sunset_adjustment_factor:0,
                  sunset_con_solar_time:0,
                  sunset_con_local_time:0,
                  day_duration:0,
                  extraterrestrial_solar_insolation:0,
                  apperent_extraterrestrial_solar_insolation:0,
                  optical_depth:0,
                  sky_diff_factor:0,
                  clear_sky_radiaton_noon:0,
                  angle_of_incidence_noon:{flat:0,tilted:0,axis1:0,axis2:0},
                  beam_insolation_noon:{flat:0,tilted:0,axis1:0,axis2:0},
                  diffuse_radiation_noon:{flat:0,tilted:0,axis1:0,axis2:0},
                  reflected_radiation_noon:{flat:0,tilted:0,axis1:0,axis2:0},
                  total_insolation_noon:{flat:0,tilted:0,axis1:0,axis2:0},
                  clear_sky_radiaton_local:0,
                  angle_of_incidence_local:{flat:0,tilted:0,axis1:0,axis2:0},
                  beam_insolation_local:{flat:0,tilted:0,axis1:0,axis2:0},
                  diffuse_radiation_local:{flat:0,tilted:0,axis1:0,axis2:0},
                  reflected_radiation_local:{flat:0,tilted:0,axis1:0,axis2:0},
                  total_insolation_local:{flat:0,tilted:0,axis1:0,axis2:0},
                  actual_power_generated:{current:0,voltage:0,power:0,efficiency:0}
                }
            }
        },
        setSolar:function(saat){
          if(saat==undefined){
            var tarih = this.date+'T'+this.time;
          }else{
            var tarih = this.date+'T'+saat;
          }
          var latlng = [this.lng,this.lat];
          var tarihobj = new Date(tarih);
          var utc = parseInt(this.utc.selected);
          this.obj = new SolarCalculater({
            date:tarihobj,
            coordinate:latlng,
            utc:utc,
            collector_azimuth_angle:this.collector_azimuth_angle,
            collector_tilt_angle:this.collector_tilt_angle,
            reflectance_of_surface:this.reflectance_of_surface,
            collector_length:this.collector_length,
            collector_width:this.collector_width,
            collector_current:this.collector_current,
            collector_voltage:this.collector_voltage,
            collector_power:this.collector_power
          });
        },
        getHour:function(a){
          a = Math.abs(a)
          var b = Math.floor(a)
          var f = a-b;
          var d = f*60;
          if(b<10){
            b='0'+b;
          }
          if(f>=0.5){
            d=Math.ceil(d);
            if(d<10){d='0'+d;}
            return b+':'+d;
          }else{
            d=Math.floor(d);
            if(d<10){d='0'+d;}
            return b+':'+d;
          }
        },
        play:function(){
          debugger;
          var that = this;
          var arr = [
            '08:00','08:15','08:30','08:45',
            '09:00','09:15','09:30','09:45',
            '10:00','10:15','10:30','10:45',
            '11:00','11:15','11:30','11:45',
            '12:00','12:15','12:30','12:45',
            '13:00','13:15','13:30','13:45',
            '14:00','14:15','14:30','14:45',
            '15:00','15:15','15:30','15:45',
            '16:00','16:15','16:30','16:45',
            '17:00','17:15','17:30','17:45',
            '18:00','18:15','18:30','18:45',
            '19:00','19:15','19:30','19:45','20:00'
          ];
          function doIt(i,ary){
            if(i<ary.length){
              setTimeout(function(){
                that.setSolar(ary[i]);
                i++;
                doIt(i,ary);
              },500);
            }else{
              alert('Bitti');
              that.setSolar();
            }
          }
          doIt(0,arr);
          
        }
    },
    template:'<div>'+
    '<table style="width: 100%; margin-bottom: 20px;" border="0" cellpadding="0" cellspacing="0">'+
      '<tr class="th0">'+
        '<th>Latitude&deg;</th>'+
        '<th>Longitude&deg;</th>'+
        '<th>Date</th>'+
        '<th>Time</th>'+
        '<th>UTC</th>'+
        '<th>Collector azimuth angle (Φc)</th>'+
        '<th>Collector tilt angle (∑)</th>'+
        '<th>Reflectance of surface (ρ)</th>'+
        '<th>Collector Length (in)</th>'+
        '<th>Collector Width (in)</th>'+
        '<th>Collector Current (Imp)</th>'+
        '<th>Collector Voltage (Vmp)</th>'+
        '<th>Collector Power (Pmax)</th>'+
        '<th>Run</th>'+
        '<th>play</th>'+
      '</tr>'+
      '<tr>'+
        '<td class="th0_2"><input type="number" v-model="lat"/></td>'+
        '<td class="th0_2"><input type="number" v-model="lng"/></td>'+
        '<td class="th0_2"><input type="date" v-model="date"/></td>'+
        '<td class="th0_2"><input type="time" v-model="time"/></td>'+
        '<td class="th0_2"><select v-model="utc.selected"><option v-for="item in utc.data" :value="item">UTC {{item}}</option></select></td>'+
        '<td class="th0_2"><input type="number" v-model="collector_azimuth_angle"/></td>'+
        '<td class="th0_2"><input type="number" v-model="collector_tilt_angle"/></td>'+
        '<td class="th0_2"><input type="number" v-model="reflectance_of_surface"/></td>'+
        '<td class="th0_2"><input type="number" v-model="collector_length"/></td>'+
        '<td class="th0_2"><input type="number" v-model="collector_width"/></td>'+
        '<td class="th0_2"><input type="number" v-model="collector_current"/></td>'+
        '<td class="th0_2"><input type="number" v-model="collector_voltage"/></td>'+
        '<td class="th0_2"><input type="number" v-model="collector_power"/></td>'+
        '<td class="th0_2"><input type="button" value="Run" @click="setSolar()"/></td>'+
        '<td class="th0_2"> <input type="button" value="play" @click="play"/></td>'+
      '</tr>'+
    '</table>'+
    '<table style="width: 100%;" border="0" cellpadding="0" cellspacing="0">'+
    '<td valign="top" align="center"><table border="0" cellpadding="0" cellspacing="0">'+
      '<tr class="th1"><th colspan="2">Time Information</th></tr>'+
      '<tr class="th1_2"><th>Time in decimal</th><td>{{obj.decimal_time.toFixed(2)}} / {{getHour(obj.decimal_time)}}</td></tr>'+
      '<tr class="th1_2"><th>Julian Day</th><td>{{obj.jday}}</td></tr>'+
      '<tr class="th1_2"><th>Longitude Correction (B)</th><td>{{obj.longitude_correction.toFixed(2)}}&deg;</td></tr>'+
      '<tr class="th1_2"><th>Equation of Time (E)</th><td>{{obj.equation_of_time.toFixed(2)}} / {{getHour(obj.equation_of_time)}}</td></tr>'+
      '<tr class="th1_2"><th>Local Meridian (LSTM)</th><td>{{obj.local_meridian}}&deg;</td></tr>'+
      '<tr class="th1_2"><th>Solar Time</th><td>{{obj.solar_time.toFixed(2)}} / {{getHour(obj.solar_time)}}</td></tr>'+
      '<tr class="th1_2"><th>Local Noon Time</th><td>{{obj.local_time.toFixed(2)}} / {{getHour(obj.local_time)}}</td></tr>'+
      '<tr class="th1_2"><th>Hours Before/After</th><td>{{obj.hours_before.toFixed(2)}} / {{getHour(obj.hours_before)}}</td></tr>'+
    '</table></td>'+

    '<td valign="top" align="center"><table border="0" cellpadding="0" cellspacing="0">'+
      '<tr class="th2"><th colspan="2">Angles Solar Noon Information</th></tr>'+
      '<tr class="th2_2"><th>Solar Declination (δ)</th><td>{{obj.solar_declination.toFixed(2)}}&deg;</td></tr>'+
      '<tr class="th2_2"><th>Solar Altitude (βn)</th><td>{{obj.solar_altitude.toFixed(2)}}&deg;</td></tr>'+
      '<tr class="th2_2"><th>Collector Tilt Angle (Σ)</th><td>{{obj.collector_tilt_angle.toFixed(2)}}&deg;</td></tr>'+
      '<tr class="th2_2"><th>Air Mass Ratio (m)</th><td>{{obj.air_mass_ratio.toFixed(3)}}</td></tr>'+
    '</table></td>'+

    '<td valign="top" align="center"><table border="0" cellpadding="0" cellspacing="0">'+
      '<tr class="th3"><th colspan="2">Angles Local Time Information</th></tr>'+
      '<tr class="th3_2"><th>Local Time</th><td>{{obj.decimal_time.toFixed(2)}} / {{getHour(obj.decimal_time)}}</td></tr>'+
      '<tr class="th3_2"><th>Solar Hour Angle (H)</th><td>{{obj.solar_hour_angle.toFixed(2)}}&deg;</td></tr>'+
      '<tr class="th3_2"><th>Solar Altitude (βn)</th><td>{{obj.local_solar_altitude.toFixed(2)}}&deg;</td></tr>'+
      '<tr class="th3_2"><th>Solar Azimuth Angle (Φs)</th><td>{{obj.solar_azimuth_angle}}&deg;</td></tr>'+
      '<tr class="th3_2"><th>Collector Tilt Angle (Σ)</th><td>{{obj.local_collector_tilt_angle.toFixed(2)}}&deg;</td></tr>'+
      '<tr class="th3_2"><th>Local Air Mass Ratio (m)</th><td>{{obj.local_air_mass_ratio.toFixed(3)}}</td></tr>'+
    '</table></td>'+

    '<td valign="top" align="center"><table border="0" cellpadding="0" cellspacing="0">'+
      '<tr class="th4"><th colspan="2">Sunrise Information</th></tr>'+
      '<tr class="th4_2"><th>Hour Angle</th><td>{{obj.sunrise_hour_angle.toFixed(2)}}&deg;</td></tr>'+
      '<tr class="th4_2"><th>Hours Before Noon</th><td>{{obj.sunrise_before_noon.toFixed(2)}} / {{getHour(obj.sunrise_before_noon)}}</td></tr>'+
      '<tr class="th4_2"><th>Geometric Solar Time</th><td>{{obj.sunrise_geo_solar_time.toFixed(2)}} / {{getHour(obj.sunrise_geo_solar_time)}}</td></tr>'+
      '<tr class="th4_2"><th>Geometric Local Time</th><td>{{obj.sunrise_geo_local_time.toFixed(2)}} / {{getHour(obj.sunrise_geo_local_time)}}</td></tr>'+
      '<tr class="th4_2"><th>Adjustment Factor (Q)</th><td>{{obj.sunrise_adjustment_factor.toFixed(2)}}</td></tr>'+
      '<tr class="th4_2"><th>Conventional Solar Time</th><td>{{obj.sunrise_con_solar_time.toFixed(2)}} / {{getHour(obj.sunrise_con_solar_time)}}</td></tr>'+
      '<tr class="th4_2"><th>Conventional Local Time</th><td>{{obj.sunrise_con_local_time.toFixed(2)}} / {{getHour(obj.sunrise_con_local_time)}}</td></tr>'+
      '<tr class="th4_2"><th>Day Duration</th><td>{{obj.day_duration.toFixed(2)}} / {{getHour(obj.day_duration)}}</td></tr>'+
    '</table></td>'+

    '<td valign="top" align="center"><table border="0" cellpadding="0" cellspacing="0">'+
      '<tr class="th5"><th colspan="2">Sunset Information</th></tr>'+
      '<tr class="th5_2"><th>Hour Angle</th><td>{{obj.sunset_hour_angle.toFixed(2)}}&deg;</td></tr>'+
      '<tr class="th5_2"><th>Hours After Noon</th><td>{{obj.sunset_after_noon.toFixed(2)}} / {{getHour(obj.sunset_after_noon)}}</td></tr>'+
      '<tr class="th5_2"><th>Geometric Solar Time</th><td>{{obj.sunset_geo_solar_time.toFixed(2)}} / {{getHour(obj.sunset_geo_solar_time)}}</td></tr>'+
      '<tr class="th5_2"><th>Geometric Local Time</th><td>{{obj.sunset_geo_local_time.toFixed(2)}} / {{getHour(obj.sunset_geo_local_time)}}</td></tr>'+
      '<tr class="th5_2"><th>Adjustment Factor (Q)</th><td>{{obj.sunset_adjustment_factor.toFixed(2)}}</td></tr>'+
      '<tr class="th5_2"><th>Conventional Solar Time</th><td>{{obj.sunset_con_solar_time.toFixed(2)}} / {{getHour(obj.sunset_con_solar_time)}}</td></tr>'+
      '<tr class="th5_2"><th>Conventional Local Time</th><td>{{obj.sunset_con_local_time.toFixed(2)}} / {{getHour(obj.sunset_con_local_time)}}</td></tr>'+
      '<tr class="th5_2"><th>Day Duration</th><td>{{obj.day_duration.toFixed(2)}} / {{getHour(obj.day_duration)}}</td></tr>'+
    '</table></td>'+

    '<td valign="top" align="center"><table border="0" cellpadding="0" cellspacing="0">'+
    '<tr class="th6"><th colspan="2">Solar Insolation Information</th></tr>'+
    '<tr class="th6_2"><th>Extraterrestrial Solar Insolation (Io)</th><td>{{obj.extraterrestrial_solar_insolation.toFixed(2)}} W/m2</td></tr>'+
    '<tr class="th6_2"><th>Apparent Extraterrestrial Solar Insolation (A)</th><td>{{obj.apperent_extraterrestrial_solar_insolation.toFixed(2)}} W/m2</td></tr>'+
    '<tr class="th6_2"><th>Optical Depth (k)</th><td>{{obj.optical_depth.toFixed(3)}}</td></tr>'+
    '<tr class="th6_2"><th>Sky diffuse factor (C)</th><td>{{obj.sky_diff_factor.toFixed(3)}}</td></tr>'+

    '<tr class="th6"><th colspan="2">Noon Time</th></tr>'+
    '<tr class="th6_2"><th>Clear Sky Radiation (IB)</th><td>{{obj.clear_sky_radiaton_noon.toFixed(3)}}  W/m2</td></tr>'+

    '<tr class="th6_2"><th colspan="2" align="center" style="background-color:#e45d8b;"><h3 style="margin: 0;">Angle of Incidence (cosθ)</h3></th></tr>'+
    '<tr><th colspan="2"><table class="table1">'+
      '<thead><tr><th>FLAT</th><th>TILTED</th><th>1-AXIS TRACKER</th><th>2-AXIS TRACKER</th></tr></thead><tbody>'+
      '<tr>'+
        '<td>{{obj.angle_of_incidence_noon.flat.toFixed(3)}}</td>'+
        '<td>{{obj.angle_of_incidence_noon.tilted.toFixed(3)}}</td>'+
        '<td>{{obj.angle_of_incidence_noon.axis1.toFixed(3)}}</td>'+
        '<td>{{obj.angle_of_incidence_noon.axis2.toFixed(3)}}</td>'+
      '</tr>'+
    '</tbody></table></th></tr>'+

    '<tr class="th6_2"><th colspan="2" align="center" style="background-color:#e45d8b;"><h3 style="margin: 0;">Beam Insolation on a Collector Face (IBC) W/m2</h3></th></tr>'+
    '<tr><th colspan="2"><table class="table1">'+
      '<thead><tr><th>FLAT</th><th>TILTED</th><th>1-AXIS TRACKER</th><th>2-AXIS TRACKER</th></tr></thead><tbody>'+
      '<tr>'+
        '<td>{{obj.beam_insolation_noon.flat.toFixed(3)}}</td>'+
        '<td>{{obj.beam_insolation_noon.tilted.toFixed(3)}}</td>'+
        '<td>{{obj.beam_insolation_noon.axis1.toFixed(3)}}</td>'+
        '<td>{{obj.beam_insolation_noon.axis2.toFixed(3)}}</td>'+
      '</tr>'+
    '</tbody></table></th></tr>'+

    '<tr class="th6_2"><th colspan="2" align="center" style="background-color:#e45d8b;"><h3 style="margin: 0;">Diffuse Radiation (IDC) W/m2</h3></th></tr>'+
    '<tr><th colspan="2"><table class="table1">'+
      '<thead><tr><th>FLAT</th><th>TILTED</th><th>1-AXIS TRACKER</th><th>2-AXIS TRACKER</th></tr></thead><tbody>'+
      '<tr>'+
        '<td>{{obj.diffuse_radiation_noon.flat.toFixed(3)}}</td>'+
        '<td>{{obj.diffuse_radiation_noon.tilted.toFixed(3)}}</td>'+
        '<td>{{obj.diffuse_radiation_noon.axis1.toFixed(3)}}</td>'+
        '<td>{{obj.diffuse_radiation_noon.axis2.toFixed(3)}}</td>'+
      '</tr>'+
    '</tbody></table></th></tr>'+

    '<tr class="th6_2"><th colspan="2" align="center" style="background-color:#e45d8b;"><h3 style="margin: 0;">Reflected Radiation (IRC) W/m2</h3></th></tr>'+
    '<tr><th colspan="2"><table class="table1">'+
      '<thead><tr><th>FLAT</th><th>TILTED</th><th>1-AXIS TRACKER</th><th>2-AXIS TRACKER</th></tr></thead><tbody>'+
      '<tr>'+
        '<td>{{obj.reflected_radiation_noon.flat.toFixed(3)}}</td>'+
        '<td>{{obj.reflected_radiation_noon.tilted.toFixed(3)}}</td>'+
        '<td>{{obj.reflected_radiation_noon.axis1.toFixed(3)}}</td>'+
        '<td>{{obj.reflected_radiation_noon.axis2.toFixed(3)}}</td>'+
      '</tr>'+
    '</tbody></table></th></tr>'+

    '<tr class="th6_2"><th colspan="2" align="center" style="background-color:#e45d8b;"><h3 style="margin: 0;">Total Insolation on a Collector (IC) W/m2</h3></th></tr>'+
    '<tr><th colspan="2"><table class="table1">'+
      '<thead><tr><th>FLAT</th><th>TILTED</th><th>1-AXIS TRACKER</th><th>2-AXIS TRACKER</th></tr></thead><tbody>'+
      '<tr>'+
        '<td>{{obj.total_insolation_noon.flat.toFixed(3)}}</td>'+
        '<td>{{obj.total_insolation_noon.tilted.toFixed(3)}}</td>'+
        '<td>{{obj.total_insolation_noon.axis1.toFixed(3)}}</td>'+
        '<td>{{obj.total_insolation_noon.axis2.toFixed(3)}}</td>'+
      '</tr>'+
    '</tbody></table></th></tr>'+

    '<tr class="th6"><th colspan="2">Local Time</th></tr>'+
    '<tr class="th6_2"><th>Clear Sky Radiation (IB)</th><td>{{obj.clear_sky_radiaton_local.toFixed(3)}}  W/m2</td></tr>'+

    '<tr class="th6_2"><th colspan="2" align="center" style="background-color:#e45d8b;"><h3 style="margin: 0;">Angle of Incidence (cosθ)</h3></th></tr>'+
    '<tr><th colspan="2"><table class="table1">'+
      '<thead><tr><th>FLAT</th><th>TILTED</th><th>1-AXIS TRACKER</th><th>2-AXIS TRACKER</th></tr></thead><tbody>'+
      '<tr>'+
        '<td>{{obj.angle_of_incidence_local.flat.toFixed(3)}}</td>'+
        '<td>{{obj.angle_of_incidence_local.tilted.toFixed(3)}}</td>'+
        '<td>{{obj.angle_of_incidence_local.axis1.toFixed(3)}}</td>'+
        '<td>{{obj.angle_of_incidence_local.axis2.toFixed(3)}}</td>'+
      '</tr>'+
    '</tbody></table></th></tr>'+

    '<tr class="th6_2"><th colspan="2" align="center" style="background-color:#e45d8b;"><h3 style="margin: 0;">Beam Insolation on a Collector Face (IBC) W/m2</h3></th></tr>'+
    '<tr><th colspan="2"><table class="table1">'+
      '<thead><tr><th>FLAT</th><th>TILTED</th><th>1-AXIS TRACKER</th><th>2-AXIS TRACKER</th></tr></thead><tbody>'+
      '<tr>'+
        '<td>{{obj.beam_insolation_local.flat.toFixed(3)}}</td>'+
        '<td>{{obj.beam_insolation_local.tilted.toFixed(3)}}</td>'+
        '<td>{{obj.beam_insolation_local.axis1.toFixed(3)}}</td>'+
        '<td>{{obj.beam_insolation_local.axis2.toFixed(3)}}</td>'+
      '</tr>'+
    '</tbody></table></th></tr>'+

    '<tr class="th6_2"><th colspan="2" align="center" style="background-color:#e45d8b;"><h3 style="margin: 0;">Diffuse Radiation (IDC) W/m2</h3></th></tr>'+
    '<tr><th colspan="2"><table class="table1">'+
      '<thead><tr><th>FLAT</th><th>TILTED</th><th>1-AXIS TRACKER</th><th>2-AXIS TRACKER</th></tr></thead><tbody>'+
      '<tr>'+
        '<td>{{obj.diffuse_radiation_local.flat.toFixed(3)}}</td>'+
        '<td>{{obj.diffuse_radiation_local.tilted.toFixed(3)}}</td>'+
        '<td>{{obj.diffuse_radiation_local.axis1.toFixed(3)}}</td>'+
        '<td>{{obj.diffuse_radiation_local.axis2.toFixed(3)}}</td>'+
      '</tr>'+
    '</tbody></table></th></tr>'+

    '<tr class="th6_2"><th colspan="2" align="center" style="background-color:#e45d8b;"><h3 style="margin: 0;">Reflected Radiation (IRC) W/m2</h3></th></tr>'+
    '<tr><th colspan="2"><table class="table1">'+
      '<thead><tr><th>FLAT</th><th>TILTED</th><th>1-AXIS TRACKER</th><th>2-AXIS TRACKER</th></tr></thead><tbody>'+
      '<tr>'+
        '<td>{{obj.reflected_radiation_local.flat.toFixed(3)}}</td>'+
        '<td>{{obj.reflected_radiation_local.tilted.toFixed(3)}}</td>'+
        '<td>{{obj.reflected_radiation_local.axis1.toFixed(3)}}</td>'+
        '<td>{{obj.reflected_radiation_local.axis2.toFixed(3)}}</td>'+
      '</tr>'+
    '</tbody></table></th></tr>'+

    '<tr class="th6_2"><th colspan="2" align="center" style="background-color:#e45d8b;"><h3 style="margin: 0;">Total Insolation on a Collector (IC) W/m2</h3></th></tr>'+
    '<tr><th colspan="2"><table class="table1">'+
      '<thead><tr><th>FLAT</th><th>TILTED</th><th>1-AXIS TRACKER</th><th>2-AXIS TRACKER</th></tr></thead><tbody>'+
      '<tr>'+
        '<td>{{obj.total_insolation_local.flat.toFixed(3)}}</td>'+
        '<td>{{obj.total_insolation_local.tilted.toFixed(3)}}</td>'+
        '<td>{{obj.total_insolation_local.axis1.toFixed(3)}}</td>'+
        '<td>{{obj.total_insolation_local.axis2.toFixed(3)}}</td>'+
      '</tr>'+
    '</tbody></table></th></tr>'+

    '<tr class="th6"><th colspan="2">Total Daily Insolation</th></tr>'+

    '<tr class="th6"><th colspan="2">Total Yearly Insolation</th></tr>'+

    '<tr class="th6"><th colspan="2">ACTUAL POWER GENERATED</th></tr>'+
    '<tr><th colspan="2"><table class="table1">'+
      '<thead><tr><th>Current</th><th>Voltage</th><th>Power</th><th>Efficiency</th></tr></thead><tbody>'+
      '<tr>'+
        '<td>{{obj.actual_power_generated.current.toFixed(2)}}</td>'+
        '<td>{{obj.actual_power_generated.voltage.toFixed(2)}}</td>'+
        '<td>{{obj.actual_power_generated.power.toFixed(2)}}</td>'+
        '<td>{{obj.actual_power_generated.efficiency.toFixed(2)}}%</td>'+
      '</tr>'+
    '</tbody></table></th></tr>'+

    '</table></td>'+

    '</tr></table></div>'
  });

var solar = new Vue({ el: '#solar' });
solar.$children[0].setSolar();