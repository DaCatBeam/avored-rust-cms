use crate::{
    error::Result,
    models::{page_model::PagePagination, Pagination},
    providers::avored_database_provider::DB,
    repositories::page_repository::PageRepository,
    PER_PAGE,
};

pub struct PageService {
    page_repository: PageRepository,
}

impl PageService {
    pub fn new(page_repository: PageRepository) -> Result<Self> {
        Ok(PageService { page_repository })
    }
}
impl PageService {
    pub async fn paginate(
        &self,
        (datastore, database_session): &DB,
        current_page: i64,
    ) -> Result<PagePagination> {
        let start = (current_page - 1) * PER_PAGE;
        let to = start + PER_PAGE;

        let admin_user_count = self
            .page_repository
            .get_total_count(datastore, database_session)
            .await?;

        let mut has_next_page = false;
        if admin_user_count.total > to {
            has_next_page = true;
        };
        let mut has_previous_page = false;
        if current_page > 1 {
            has_previous_page = true;
        };

        let pagination = Pagination {
            total: admin_user_count.total,
            per_page: PER_PAGE,
            current_page,
            from: (start + 1),
            to,
            has_previous_page,
            next_page_number: (current_page + 1),
            has_next_page,
            previous_page_number: (current_page - 1),
        };

        let pages = self
            .page_repository
            .paginate(datastore, database_session, start)
            .await?;

        // println!("{:?}", pages);

        Ok(PagePagination {
            data: pages,
            pagination,
        })
    }
}
