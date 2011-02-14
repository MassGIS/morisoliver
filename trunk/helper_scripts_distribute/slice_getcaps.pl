#!/usr/bin/perl

use strict;
use XML::Simple;
use LWP::Simple;
use Data::Dumper;

my $tmp_dir  = '/tmp';
my $dest_dir = '/var/www/html/temp/OL_MORIS_cache';

open F,">$dest_dir/getCapsBbox.js";
print F "var getCapsBbox = [];\n";

getstore('http://giswebservices.massgis.state.ma.us/geoserver/wms?SERVICE=wms&VERSION=1.1.0&REQUEST=GetCapabilities',"$tmp_dir/massgis_getcaps.xml");
my $getcaps = XMLin("$tmp_dir/massgis_getcaps.xml",ForceArray=>1,KeepRoot=>1);
my @l = @{$getcaps->{WMT_MS_Capabilities}[0]->{Capability}[0]->{Layer}[0]->{Layer}};
for (my $i = 0; $i <= $#l; $i++) {
  my %h = %{$l[$i]};
  if ($h{Name}[0] ne 'massgis:GISDATA.NAVTEQRDS_ARC') {
#    next;
  }
  print "$h{Name}[0]\n";
  if (defined $h{Style}) {
    my @a = @{$h{Style}};
    for (my $j = 0; $j <= $#a; $j++) {
      my $t = time;
      my $style_name = $a[$j]{Name}[0];
      my $u = "http://giswebservices.massgis.state.ma.us/geoserver/rest/styles/$style_name.xml?$t";
      getstore($u,"$tmp_dir/filename.xml");
      if (-s "$tmp_dir/filename.xml") {
        my $filename = XMLin("$tmp_dir/filename.xml",ForceArray=>1,KeepRoot=>1);
        my $u = "http://giswebservices.massgis.state.ma.us/geoserver/www/styles/".$filename->{'style'}[0]->{'filename'}[0]."?$t";
        print "\t$u\n";
        getstore($u,"$tmp_dir/style.xml");
        if (-s "$tmp_dir/style.xml") {
          my $style = XMLin("$tmp_dir/style.xml",ForceArray=>1,KeepRoot=>1);
          # stick min/maxScaleDenominators in the summary if found
          $l[$i]->{Scale} = ();
          my $maxScaleDenominator = get_denom('MaxScaleDenominator',$style);
          my $minScaleDenominator = get_denom('MinScaleDenominator',$style);
          if (defined $minScaleDenominator) {
            $l[$i]->{Scale}[0]{minScaleDenominator} = $minScaleDenominator;
          }
          if (defined $maxScaleDenominator) {
            $l[$i]->{Scale}[0]{maxScaleDenominator} = $maxScaleDenominator;
          }
        }
        @{$l[$i]->{Style}} = ();
        @{$l[$i]->{Abstract}} = ();
        my $f = "$h{Name}[0].$style_name";
        $f =~ s/:/_/g;
        print "\t$dest_dir/$f.xml\n";
        open my $fh,">$dest_dir/$f.xml";
        XMLout($l[$i],OutputFile=>$fh,XMLDecl=>1,RootName=>'Layer');
        close $fh;
      }
    }
  }
  else {
    my $f = "$h{Name}[0].";
    $f =~ s/:/_/g;
    print "\t$dest_dir/$f.xml\n";
    open my $fh,">$dest_dir/$f.xml";
    @{$l[$i]->{Style}} = ();
    @{$l[$i]->{Abstract}} = ();
    XMLout($l[$i],OutputFile=>$fh,XMLDecl=>1,RootName=>'Layer');
    close $fh;
  }
  print F 'getCapsBbox[\''.$h{Name}[0]."'] = new OpenLayers.Bounds($h{LatLonBoundingBox}[0]{minx},$h{LatLonBoundingBox}[0]{miny},$h{LatLonBoundingBox}[0]{maxx},$h{LatLonBoundingBox}[0]{maxy});\n";
}

close F;

sub get_denom {
  my ($min_max,$style) = @_;
  if (defined $style->{'wms:GetMap'}[0]) {
    $style = $style->{'wms:GetMap'}[0];
  }
  if (defined $style->{'sld:StyledLayerDescriptor'}[0]) {
    $style = $style->{'sld:StyledLayerDescriptor'}[0];
  }
  elsif (defined $style->{'StyledLayerDescriptor'}[0]) {
    $style = $style->{'StyledLayerDescriptor'}[0];
  }
  if (defined $style->{'sld:NamedLayer'}[0]) {
    $style = $style->{'sld:NamedLayer'}[0];
  }
  elsif (defined $style->{'NamedLayer'}[0]) {
    $style = $style->{'NamedLayer'}[0];
  }
  if (defined $style->{'sld:UserStyle'}[0]) {
    $style = $style->{'sld:UserStyle'}[0];
  }
  elsif (defined $style->{'UserStyle'}[0]) {
    $style = $style->{'UserStyle'}[0];
  }
  if (defined $style->{'sld:FeatureTypeStyle'}[0]) {
    $style = $style->{'sld:FeatureTypeStyle'}[0];
  }
  elsif (defined $style->{'FeatureTypeStyle'}[0]) {
    $style = $style->{'FeatureTypeStyle'}[0];
  }
  if (defined $style->{'sld:Rule'}[0]) {
    $style = $style->{'sld:Rule'}[0];
  }
  elsif (defined $style->{'Rule'}[0]) {
    $style = $style->{'Rule'}[0];
  }
  if (defined $style->{"sld:$min_max"}[0]) {
    return $style->{"sld:$min_max"}[0];
  }
  elsif (defined $style->{"$min_max"}[0]) {
    return $style->{"$min_max"}[0];
  }
}
