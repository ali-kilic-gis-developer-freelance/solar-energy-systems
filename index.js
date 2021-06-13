class SolarCalculater{
  constructor(props){
    this.lng = props.coordinate[0];
    this.lat = props.coordinate[1];
    this.date = new Date(props.date);
    this.utc = Math.abs(props.utc);
    this.collector_azimuth_angle=props.collector_azimuth_angle;
    this.collector_tilt_angle_val=props.collector_tilt_angle;
    this.reflectance_of_surface = props.reflectance_of_surface;
    this.collector_length=props.collector_length;
    this.collector_width=props.collector_width;
    this.collector_current=props.collector_current;
    this.collector_voltage=props.collector_voltage;
    this.collector_power=props.collector_power;
    this.hour = this.date.getHours();
    this.minute = this.date.getMinutes();
    this.decimal_time = this.hour+(this.minute/60);
    this.jday = this.getJulianDay();
    this.longitude_correction = this.getLonCorrection();
    this.equation_of_time=this.getEquation_of_time();
    this.local_meridian = this.getLocalMeridian();
    this.solar_time = this.getSolarTime();
    this.local_time = this.getLocalTime();
    this.hours_before = this.local_time-this.decimal_time;
    this.after_noon = Math.abs(this.hours_before)/24;
    this.solar_declination = this.getSolarDeclination();
    this.solar_altitude = this.getSolarAltitude();
    this.collector_tilt_angle = this.getCollectorAngle();
    this.air_mass_ratio = this.getAirMass();
    this.solar_hour_angle = 15*this.hours_before;
    this.local_solar_altitude = this.getLocalSolarAltitude();
    this.solar_azimuth_angle = this.getSolarAzimuthAngle();
    this.local_collector_tilt_angle = 90-this.local_solar_altitude;
    this.local_air_mass_ratio = this.getLocalAirMass();

    this.sunrise_hour_angle = this.getSunriseHourAngle();
    this.sunrise_before_noon = this.sunrise_hour_angle/15;
    this.sunrise_geo_solar_time = 12-(this.sunrise_hour_angle/15);
    this.sunrise_geo_local_time = this.sunrise_geo_solar_time-(12-this.local_time);
    this.sunrise_adjustment_factor = this.getSunriseAdjustmentFactor();
    this.sunrise_con_solar_time = this.sunrise_geo_solar_time-(this.sunrise_adjustment_factor/60);
    this.sunrise_con_local_time = this.sunrise_con_solar_time-(12-this.local_time);

    this.sunset_hour_angle = this.getSunriseHourAngle();
    this.sunset_after_noon = this.sunset_hour_angle/15;
    this.sunset_geo_solar_time = 12+(this.sunset_hour_angle/15);
    this.sunset_geo_local_time = this.sunset_geo_solar_time-(12-this.local_time);
    this.sunset_adjustment_factor = this.getSunsetAdjustmentFactor();
    this.sunset_con_solar_time = this.sunset_geo_solar_time+(this.sunset_adjustment_factor/60);
    this.sunset_con_local_time = this.sunset_con_solar_time-(12-this.local_time);

    this.day_duration = this.sunset_con_local_time-this.sunrise_geo_local_time;

    this.extraterrestrial_solar_insolation = this.getExtTerSolIns();
    this.apperent_extraterrestrial_solar_insolation = this.getAppExtTerSolIns();
    this.optical_depth = this.getOpticalDepth();
    this.sky_diff_factor = this.getSkyDiffFactor();

    this.clear_sky_radiaton_noon = this.getClearRadiationNoon();
    this.angle_of_incidence_noon = this.getAngleOfIncidenceNoon();
    this.beam_insolation_noon = this.getBeamInsolationNoon();
    this.diffuse_radiation_noon = this.getDiffRadiationNoon();
    this.reflected_radiation_noon = this.getReflectedRadiationNoon();
    this.total_insolation_noon = this.getTotalInsolationNoon();

    this.clear_sky_radiaton_local = this.getClearRadiationLocal();
    this.angle_of_incidence_local = this.getAngleOfIncidenceLocal();
    this.beam_insolation_local = this.getBeamInsolationLocal();
    this.diffuse_radiation_local = this.getDiffRadiationLocal();
    this.reflected_radiation_local = this.getReflectedRadiationLocal();
    this.total_insolation_local = this.getTotalInsolationLocal();

    this.actual_power_generated = this.getActualPowerGenerated();
  }

  getActualPowerGenerated(){
    debugger;
    var s1 = (this.collector_length/39.37)*(this.collector_width/39.37);
    var s2 = 0;
    if(this.local_solar_altitude>0){
      s2=this.apperent_extraterrestrial_solar_insolation*Math.exp(-1*this.optical_depth*1.5);
    }else{
      s2=0;
    }
    var s3 = 1*this.collector_power/s1;
    var s4 = s3*s2/1000;
    var s5 = s1*s4;
    var voltage = 0;
    if(this.local_solar_altitude>0){
      voltage = this.collector_voltage;
    }
    var power = s5;
    var current = power/voltage;
    var efficiency = (s4/this.clear_sky_radiaton_noon)*100;

    return {current:current,voltage:voltage,power:power,efficiency:efficiency};
  }

  getTotalInsolationLocal(){
    var flat = this.beam_insolation_local.flat+this.diffuse_radiation_local.flat+this.reflected_radiation_local.flat;
    var tilted = this.beam_insolation_local.tilted+this.diffuse_radiation_local.tilted+this.reflected_radiation_local.tilted;
    var axis1 = this.beam_insolation_local.axis1+this.diffuse_radiation_local.axis1+this.reflected_radiation_local.axis1;
    var axis2 = this.beam_insolation_local.axis2+this.diffuse_radiation_local.axis2+this.reflected_radiation_local.axis2;
    return {flat:flat,tilted:tilted,axis1:axis1,axis2:axis2};
  }

  getReflectedRadiationLocal(){
    var flat = this.reflectance_of_surface*this.clear_sky_radiaton_local*(Math.sin(this.deg2rad(this.local_solar_altitude))+this.sky_diff_factor)*((1-Math.cos(this.deg2rad(0)))/2);
    var tilted = this.reflectance_of_surface*this.clear_sky_radiaton_local*((Math.sin(this.deg2rad(this.local_solar_altitude)))+this.sky_diff_factor)*((1-Math.cos(this.deg2rad(this.collector_tilt_angle_val)))/2);
    var axis1 = this.reflectance_of_surface*((this.clear_sky_radiaton_local*Math.sin(this.deg2rad(this.local_solar_altitude)))+(this.sky_diff_factor*this.clear_sky_radiaton_local))*((1-Math.cos(this.deg2rad(90-this.local_solar_altitude+this.solar_declination)))/2)
    var axis2 = this.reflectance_of_surface*((this.clear_sky_radiaton_local*Math.sin(this.deg2rad(this.local_solar_altitude)))+(this.sky_diff_factor*this.clear_sky_radiaton_local))*((1-Math.cos(this.deg2rad(90-this.local_solar_altitude)))/2)
    return {flat:flat,tilted:tilted,axis1:axis1,axis2:axis2};
  }

  getDiffRadiationLocal(){
    var flat = this.sky_diff_factor*this.clear_sky_radiaton_local;
    var tilted = flat*((1+Math.cos(this.deg2rad(this.collector_tilt_angle_val)))/2);
    var axis1 = flat*((1+Math.cos(this.deg2rad(90-this.local_solar_altitude+this.solar_declination)))/2);
    var axis2 = flat*((1+Math.cos(this.deg2rad(90-this.local_solar_altitude)))/2);
    return {flat:flat,tilted:tilted,axis1:axis1,axis2:axis2};
  }

  getBeamInsolationLocal(){
    var flat = this.clear_sky_radiaton_local*this.angle_of_incidence_local.flat;
    var tilted = this.clear_sky_radiaton_local*this.angle_of_incidence_local.tilted;
    var axis1 = this.clear_sky_radiaton_local*Math.cos(this.deg2rad(this.solar_declination));
    var axis2 = this.clear_sky_radiaton_local*this.angle_of_incidence_local.axis2; 
    return {flat:flat,tilted:tilted,axis1:axis1,axis2:axis2};
  }

  getAngleOfIncidenceLocal(){
    var flat = Math.cos(this.deg2rad(this.local_solar_altitude))*Math.cos(this.deg2rad(this.solar_azimuth_angle-this.collector_azimuth_angle))*Math.sin(this.deg2rad(0))+(Math.sin(this.deg2rad(this.local_solar_altitude))*Math.cos(this.deg2rad(0)));
    var tilted = Math.cos(this.deg2rad(this.local_solar_altitude))*Math.cos(this.deg2rad(0-this.solar_azimuth_angle))*Math.sin(this.deg2rad(this.collector_tilt_angle_val))+Math.sin(this.deg2rad(this.local_solar_altitude))*Math.cos(this.deg2rad(this.collector_tilt_angle_val));
    var axis1 = Math.cos(this.deg2rad(this.local_solar_altitude))*Math.cos(this.deg2rad(0-0))*Math.sin(this.deg2rad(this.collector_tilt_angle_val))+Math.sin(this.deg2rad(this.local_solar_altitude))*Math.cos(this.deg2rad(this.collector_tilt_angle_val));
    var axis2 = Math.cos(this.deg2rad(this.local_solar_altitude))*Math.cos(this.deg2rad(0-0))*Math.sin(this.deg2rad(90-this.local_solar_altitude))+Math.sin(this.deg2rad(this.local_solar_altitude))*Math.cos(this.deg2rad(90-this.local_solar_altitude));
    return {flat:flat,tilted:tilted,axis1:axis1,axis2:axis2};
  }

  getClearRadiationLocal(){
    if(this.local_solar_altitude>0){
      return this.apperent_extraterrestrial_solar_insolation*Math.exp(-1*this.optical_depth*this.local_air_mass_ratio);
    }else{
      return 0;
    }
  }

  getTotalInsolationNoon(){
    var flat = this.beam_insolation_noon.flat+this.diffuse_radiation_noon.flat+this.reflected_radiation_noon.flat;
    var tilted = this.beam_insolation_noon.tilted+this.diffuse_radiation_noon.tilted+this.reflected_radiation_noon.tilted;
    var axis1 = this.beam_insolation_noon.axis1+this.diffuse_radiation_noon.axis1+this.reflected_radiation_noon.axis1;
    var axis2 = this.beam_insolation_noon.axis2+this.diffuse_radiation_noon.axis2+this.reflected_radiation_noon.axis2;
    return {flat:flat,tilted:tilted,axis1:axis1,axis2:axis2};
  }

  getReflectedRadiationNoon(){
    var flat = this.reflectance_of_surface*this.clear_sky_radiaton_noon*(Math.sin(this.deg2rad(this.solar_altitude))+this.sky_diff_factor)*((1-Math.cos(this.deg2rad(0)))/2);
    var tilted = this.reflectance_of_surface*this.clear_sky_radiaton_noon*((Math.sin(this.deg2rad(this.solar_altitude)))+this.sky_diff_factor)*((1-Math.cos(this.deg2rad(this.collector_tilt_angle_val)))/2);
    var axis1 = this.reflectance_of_surface*((this.clear_sky_radiaton_noon*Math.sin(this.deg2rad(this.solar_altitude)))+(this.sky_diff_factor*this.clear_sky_radiaton_noon))*((1-Math.cos(this.deg2rad(90-this.solar_altitude+this.solar_declination)))/2)
    var axis2 = this.reflectance_of_surface*((this.clear_sky_radiaton_noon*Math.sin(this.deg2rad(this.solar_altitude)))+(this.sky_diff_factor*this.clear_sky_radiaton_noon))*((1-Math.cos(this.deg2rad(90-this.solar_altitude)))/2)
    return {flat:flat,tilted:tilted,axis1:axis1,axis2:axis2};
  }

  getDiffRadiationNoon(){
    var flat = this.sky_diff_factor*this.clear_sky_radiaton_noon;
    var tilted = flat*((1+Math.cos(this.deg2rad(this.collector_tilt_angle_val)))/2);
    var axis1 = flat*((1+Math.cos(this.deg2rad(90-this.solar_altitude+this.solar_declination)))/2);
    var axis2 = flat*((1+Math.cos(this.deg2rad(90-this.solar_altitude)))/2);
    return {flat:flat,tilted:tilted,axis1:axis1,axis2:axis2};
  }

  getBeamInsolationNoon(){
    var flat = this.clear_sky_radiaton_noon*this.angle_of_incidence_noon.flat;
    var tilted = this.clear_sky_radiaton_noon*this.angle_of_incidence_noon.tilted;
    var axis1 = this.clear_sky_radiaton_noon*Math.cos(this.deg2rad(this.solar_declination));
    var axis2 = this.clear_sky_radiaton_noon*this.angle_of_incidence_noon.axis2; 
    return {flat:flat,tilted:tilted,axis1:axis1,axis2:axis2};
  }

  getAngleOfIncidenceNoon(){
    var flat = Math.cos(this.deg2rad(this.solar_altitude))*Math.cos(this.deg2rad(0-this.collector_azimuth_angle))*Math.sin(this.deg2rad(0))+Math.sin(this.deg2rad(this.solar_altitude))*Math.cos(this.deg2rad(0));
    var tilted = Math.cos(this.deg2rad(this.solar_altitude))*Math.cos(this.deg2rad(0-this.collector_azimuth_angle))*Math.sin(this.deg2rad(this.collector_tilt_angle_val))+Math.sin(this.deg2rad(this.solar_altitude))*Math.cos(this.deg2rad(this.collector_tilt_angle_val));
    var axis1 = Math.cos(this.deg2rad(this.solar_altitude))*Math.cos(this.deg2rad(0-0))*Math.sin(this.deg2rad(this.collector_tilt_angle_val))+Math.sin(this.deg2rad(this.solar_altitude))*Math.cos(this.deg2rad(this.collector_tilt_angle_val));
    var axis2 = Math.cos(this.deg2rad(this.solar_altitude))*Math.cos(this.deg2rad(0-0))*Math.sin(this.deg2rad(90-this.solar_altitude))+Math.sin(this.deg2rad(this.solar_altitude))*Math.cos(this.deg2rad(90-this.solar_altitude));
    return {flat:flat,tilted:tilted,axis1:axis1,axis2:axis2};
  }

  getClearRadiationNoon(){
    return this.apperent_extraterrestrial_solar_insolation*Math.exp(-1*this.optical_depth*this.air_mass_ratio);
  }

  getSkyDiffFactor(){
    return 0.095+0.04*Math.sin(this.deg2rad(360/365*(this.jday-100)));
  }

  getOpticalDepth(){
    return 0.174+0.035*Math.sin(this.deg2rad(360/365*(this.jday-100)));
  }

  getAppExtTerSolIns(){
    return 1160+75*Math.sin(this.deg2rad((360/365)*(this.jday-275)))
  }

  getExtTerSolIns(){
    return 1370*(1+0.034*Math.cos(this.deg2rad(360*this.jday)/365));
  }

  getSunsetAdjustmentFactor(){
    return 3.467/(Math.cos(this.deg2rad(this.lat))*Math.cos(this.deg2rad(this.solar_declination))*Math.sin(this.deg2rad(this.sunset_hour_angle)))
  }

  getSunriseAdjustmentFactor(){
    return 3.467/(Math.cos(this.deg2rad(this.lat))*Math.cos(this.deg2rad(this.solar_declination))*Math.sin(this.deg2rad(this.sunrise_hour_angle)))
  }

  getSunriseHourAngle(){
    return this.rad2deg(Math.acos((-Math.tan(this.deg2rad(this.lat))*Math.tan(this.deg2rad(this.solar_declination)))))
  }

  getJulianDay(){
    var months = [0,31,59,90,120,151,181,212,243,273,304,334];
    return months[this.date.getMonth()]+this.date.getDate();
  }

  deg2rad(t){
    return t*(Math.PI/180);
  }

  rad2deg(t){
    return (t*180)/Math.PI;
  }

  getLonCorrection(){
    return (360/364*(this.jday-81));
  }

  getEquation_of_time(){
    return (9.87*Math.sin(this.deg2rad(2*this.longitude_correction)))-(7.53*Math.cos(this.deg2rad(this.longitude_correction)))-(1.5*Math.sin(this.deg2rad(this.longitude_correction)));
  }

  getSolarTime(){
    return (this.decimal_time*60+4*(this.local_meridian-this.lng)+this.equation_of_time)/60;
  }

  getLocalTime(){
    return ((12*60)-4*(this.local_meridian-this.lng)-(this.equation_of_time))/60;
  }

  isAfterNoon(){
    return this.hours_before<0?true:false;
  }

  getLocalMeridian(){
    return this.utc*15;
  }

  getSolarDeclination(){
    return 23.45*Math.sin(this.deg2rad(360/365*(this.jday-81)));
  }

  getSolarAltitude(){
    return (90-this.lat+this.solar_declination)
  }

  getLocalSolarAltitude(){
    return this.rad2deg(Math.asin(Math.cos(this.deg2rad(this.lat))*Math.cos(this.deg2rad(this.solar_declination))*Math.cos(this.deg2rad(this.solar_hour_angle))+Math.sin(this.deg2rad(this.lat))*Math.sin(this.deg2rad(this.solar_declination))))
  }

  getCollectorAngle(){
    return 90-this.solar_altitude;
  }

  getAirMass(){
    return Math.abs(1/Math.sin(this.deg2rad(this.solar_altitude)));
  }

  getLocalAirMass(){
    return Math.abs(1/Math.sin(this.deg2rad(this.local_solar_altitude)))
  }

  getSolarAzimuthAngle(){
    var t1 = Math.cos(this.deg2rad(this.solar_hour_angle));
    var t2 = Math.tan(this.deg2rad(this.solar_declination))/Math.tan(this.deg2rad(this.lat));
    var s1 = this.rad2deg(Math.asin(Math.cos(this.deg2rad(this.solar_declination))*Math.sin(this.deg2rad(this.solar_hour_angle))/Math.cos(this.deg2rad(this.local_solar_altitude))));
    if(t1>=t2){
      return s1;
    }else{
      if(this.decimal_time<12){
        return 180-s1;
      }else{
        return 180-s1-360;
      }
    }
  }
}