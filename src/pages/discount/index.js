import { useCallback, useMemo, useState } from 'react';
import Head from 'next/head';
import ArrowDownOnSquareIcon from '@heroicons/react/24/solid/ArrowDownOnSquareIcon';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import {
  Box,
  Button,
  Container,
  Grid,
  Link,
  Stack,
  SvgIcon,
  Typography,
} from '@mui/material';
import { useSelection } from 'src/hooks/use-selection';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { applyPagination } from 'src/utils/apply-pagination';
import DiscountTable from 'src/pages/discount/components/discount-table';
import { useCatalogs } from 'src/hooks/use-catalogs';
import ExportButton from 'src/components/export-button';
import { CATALOGS_FIELDS } from 'src/utils/catalogs-report-fields';
import SynchronizationDialog from 'src/components/synchronizationDialog';

const now = new Date();

const useDiscount = (page, rowsPerPage) => {
  const { state } = useCatalogs();
  const data = state.discount?.data;

  return useMemo(() => {
    return applyPagination(data, page, rowsPerPage);
  }, [data, page, rowsPerPage]);
};

const useIds = data => {
  return useMemo(() => {
    return data.map(d => d.id);
  }, [data]);
};

const Page = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const dataList = useDiscount(page, rowsPerPage);
  const ids = useIds(dataList);
  const userSelection = useSelection(ids);
  const { state, getDiscount } = useCatalogs();

  const data = state.discount?.data;
  const filteredData = state.discount?.filteredData;

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
  }, []);

  const handleSearch = useCallback(
    (event, value) => {
      filteredData.slice(0, filteredData.length);
    },
    [filteredData],
  );

  const handleRowsPerPageChange = useCallback(event => {
    setRowsPerPage(event.target.value);
  }, []);

  return (
    <>
      <Head>
        <title>Descuento</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">Descuento</Typography>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <ExportButton
                    style={{ marginRight: '8px' }}
                    fields={CATALOGS_FIELDS.USER_FIELDS}
                    data={data}
                  />
                  <SynchronizationDialog
                    name="los descuentos"
                    endpoint="discount"
                  />
                </div>
              </Stack>
              <div>
                <Link href={'/discount/add'}>
                  <Button
                    startIcon={
                      <SvgIcon fontSize="small">
                        <PlusIcon />
                      </SvgIcon>
                    }
                    variant="contained"
                  >
                    Nuevo
                  </Button>
                </Link>
              </div>
            </Stack>
            <DiscountTable
              count={data.length}
              items={dataList}
              onDeselectAll={userSelection.handleDeselectAll}
              onDeselectOne={userSelection.handleDeselectOne}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              onSelectAll={userSelection.handleSelectAll}
              onSelectOne={userSelection.handleSelectOne}
              page={page}
              rowsPerPage={rowsPerPage}
              selected={userSelection.selected}
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = page => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
