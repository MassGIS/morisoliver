#!/usr/bin/perl

use strict;
use XML::LibXML;
use LWP::Simple;
use Data::Dumper;
use JSON;

my @getcaps = (
  'https://wms.appgeo.com/login/path/sonata-alpine-vienna-oasis/wmts/1.0.0/WMTSCapabilities.xml'
);

my @services;
foreach my $url (@getcaps) {
  print STDERR $url."\n";

  my $parser = XML::LibXML->new->parse_string(get($url));
  my $xml = XML::LibXML::XPathContext->new($parser);

  $xml->registerNs(
    'wmts',
    'http://www.opengis.net/wmts/1.0'
  );
  $xml->registerNs(
    'ows',
    'http://www.opengis.net/ows/1.1'
  );

  my %service = (
    'title' =>  ${$xml->findnodes('//ows:ServiceIdentification/ows:Title')}[0]->textContent,
    'url' => ${$xml->findnodes('//ows:Operation[@name="GetTile"]//ows:Get/@xlink:href')}[0]->textContent,
    'layers' => []
  );
  for my $layer ($xml->findnodes('//wmts:Layer')) {
    my %layer;
    $layer{title} = ${$layer->findnodes('./ows:Title')}[0]->textContent;
    $layer{layer} = ${$layer->findnodes('./ows:Identifier')}[0]->textContent;
    for my $tile_matrix_set_link ($layer->findnodes(".//*[name()='TileMatrixSetLink']")) {
      $layer{matrix_set} = ${$tile_matrix_set_link->findnodes(".//*[name()='TileMatrixSet']")}[0]->textContent;
      $layer{matrix_ids} = ();
      for my $tile_matrix_limits ($layer->findnodes(".//*[name()='TileMatrixLimits']")) {
        push(@{$layer{matrix_ids}},${$tile_matrix_limits->findnodes(".//*[name()='TileMatrix']")}[0]->textContent);
      }
    }
    push(@{$service{layers}}, \%layer);
  }

  push(@services, \%service);
}

my $json = JSON->new->allow_nonref;
print $json->pretty->encode(\@services);
