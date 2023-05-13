import { Component } from 'react';

import * as ImageService from 'service/image-service';
import { Button, SearchForm, Grid, GridItem, Text, CardItem } from 'components';

export class Gallery extends Component {
  state = {
    query: '',
    page: 1,
    images: [],
    perPage: 15,
    totalResults: 0,
    error: null,
    showGallery: false,
    isLoading: false,
  };

  componentDidUpdate(prevProps, prevState) {
    const { query, page } = this.state;
    if (prevState.query !== query || prevState.page !== page) {
      this.getPhotos(query, page);
    }
  }

  handleSubmit = data => {
    this.setState({
      query: data,
      page: 1,
      images: [],
      perPage: 15,
      totalResults: 0,
      error: null,
      showGallery: false,
      isLoading: false,
    });
  };

  getPhotos = async (query, page) => {
    this.setState({ isLoading: true });
    try {
      const { photos, per_page, total_results } = await ImageService.getImages(
        query,
        page
      );
      this.setState(prevState => ({
        images: [...prevState.images, ...photos],
        perPage: per_page,
        totalResults: total_results,
      }));
      if (photos.length === 0) {
        this.setState({
          showGallery: true,
        });
      }
    } catch (error) {
      this.setState({
        error: error.message,
      });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  handleLoadMore = () => {
    this.setState(prevState => ({
      page: prevState.page + 1,
    }));
  };

  render() {
    const { images, totalResults, showGallery, error, isLoading } = this.state;
    return (
      <>
        <SearchForm onSubmit={this.handleSubmit} />
        {showGallery && (
          <Text textAlign="center">Sorry. There are no images ... 😭</Text>
        )}
        {error && <Text textAlign="center">Sorry. There are {error} 😭</Text>}
        {images.length > 0 && (
          <Grid>
            {images?.map(({ id, avg_color, alt, src }) => (
              <GridItem key={id}>
                <CardItem color={avg_color}>
                  <img src={src.large} alt={alt} />
                </CardItem>
              </GridItem>
            ))}
          </Grid>
        )}
        {images.length > 0 && images.length < totalResults && (
          <Button onClick={this.handleLoadMore}>
            {isLoading ? 'Loading...' : 'Load more'}
          </Button>
        )}
      </>
    );
  }
}
