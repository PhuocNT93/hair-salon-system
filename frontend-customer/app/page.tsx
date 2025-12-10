"use client";

import * as React from 'react';
import { useTranslations } from 'next-intl';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid2';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import FaceIcon from '@mui/icons-material/Face';
import Link from 'next/link';
import { Navbar } from "@/components/layout/navbar";

export default function Home() {
  const t = useTranslations();

  const services = [
    {
      title: t('home.haircutTitle'),
      icon: ContentCutIcon,
      desc: t('home.haircutDesc')
    },
    {
      title: t('home.stylingTitle'),
      icon: FaceIcon,
      desc: t('home.stylingDesc')
    },
    {
      title: t('home.bookingTitle'),
      icon: EventAvailableIcon,
      desc: t('home.bookingDesc')
    },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />

      <Box component="main" sx={{ flexGrow: 1 }}>
        {/* Hero Section */}
        <Box
          sx={{
            py: { xs: 8, md: 12 },
            background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
            color: 'white',
            textAlign: 'center',
          }}
        >
          <Container maxWidth="md">
            <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
              {t('home.heroTitle')}
            </Typography>
            <Typography variant="h5" component="p" gutterBottom sx={{ mb: 4, opacity: 0.9 }}>
              {t('home.heroDescription')}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Button
                component={Link}
                href="/book"
                variant="contained"
                size="large"
                sx={{ bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: 'grey.100' } }}
              >
                {t('home.bookAppointment')}
              </Button>
              <Button
                component={Link}
                href="/login"
                variant="outlined"
                size="large"
                sx={{ color: 'white', borderColor: 'white', '&:hover': { borderColor: 'grey.100', bgcolor: 'rgba(255,255,255,0.1)' } }}
              >
                {t('home.clientLogin')}
              </Button>
            </Box>
          </Container>
        </Box>

        {/* Services Section */}
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Typography variant="h3" component="h2" textAlign="center" gutterBottom fontWeight="bold">
            {t('home.servicesTitle')}
          </Typography>
          <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ mb: 6 }}>
            {t('home.servicesSubtitle')}
          </Typography>

          <Grid container spacing={4}>
            {services.map((item, index) => (
              <Grid size={{ xs: 12, md: 4 }} key={index}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', textAlign: 'center', p: 2, transition: '0.3s', '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 } }}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                    <item.icon sx={{ fontSize: 60, color: 'primary.main' }} />
                  </Box>
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div" fontWeight="medium">
                      {item.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {item.desc}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Footer */}
      <Box component="footer" sx={{ py: 4, px: 2, mt: 'auto', backgroundColor: (theme) => theme.palette.grey[100] }}>
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            {'© '}
            {new Date().getFullYear()}
            {' '}{t('home.footerCopyright')}
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
