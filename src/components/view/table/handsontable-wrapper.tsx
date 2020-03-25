import { Intent, NonIdealState, Spinner } from '@blueprintjs/core';
import Handsontable from 'handsontable';
import React from 'react';

interface LoadingProps {
  loading?: boolean;
}

const Loading = ({ loading }: LoadingProps) =>
  loading ? (
    <NonIdealState
      icon={<Spinner intent={Intent.PRIMARY} />}
      title="Loading..."
      description="Please wait..."
    />
  ) : null;

interface Props {
  className?: string;
  tableData: any;
}

/**
 * Make a react wrapper to handsontable
 *
 * Even though handsontable has an official react wrapper, I decided not
 * to use it because we want the component to be uncontrolled.
 */
const HandsontableWrapper = ({ className, tableData }: Props) => {
  const [loading, setLoading] = React.useState(true);
  const ref = React.createRef<HTMLDivElement>();

  React.useEffect(() => {
    setLoading(true);

    if (!ref.current) {
      return;
    }

    // This effectively takes a snapshot of the tableData, and it will
    // contain information when the spreadsheet is first rendered.  This is
    // important, because we don't want to refresh tableData from graphQL
    // until the next time the spreadsheet mounts.
    // Handsontable will modify the data in tableData in place, so it will
    // actually hold formula in the data cells.  Which is important for
    // the 'afterChange' hook.

    const hot = new Handsontable(ref.current, {
      // colHeaders: true, // overrode by nestedHeaders
      // rowHeaders: true,
      licenseKey: 'non-commercial-and-evaluation',
      // height: '100%',
      manualRowResize: true,
      manualColumnResize: true,
      formulas: false,
      data: tableData,
      readOnly: true,
    });

    setLoading(false);

    return () => {
      hot.destroy();
    };
  }, []);

  return (
    <div className={className}>
      <Loading loading={loading} />
      <div ref={ref} />
    </div>
  );
};

export default HandsontableWrapper;
