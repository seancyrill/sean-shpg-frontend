function useRefreshPage() {
  const refreshPage = () => {
    window.location.reload();
  };

  return { refreshPage };
}

export default useRefreshPage;
