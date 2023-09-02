use axum::extract::State;
use axum::response::{Html, IntoResponse};
use serde::Serialize;
use std::sync::Arc;

use crate::avored_state::AvoRedState;
use crate::models::admin_user_model::AdminUser;
use crate::models::role_model::RoleModel;
use crate::providers::avored_session_provider::AvoRedSession;

pub async fn role_table_handler(
    state: State<Arc<AvoRedState>>,
    session: AvoRedSession,
) -> impl IntoResponse {
    let logged_in_user = match session.get("logged_in_user") {
        Some(logged_in_user) => logged_in_user,
        None => AdminUser::empty_admin_user(),
    };

    let roles = state
        .role_service
        .paginate(&state.datastore, &state.database_session, 0)
        .await
        .unwrap_or(vec![]);

    let mut view_model = RoleTableViewModel::new();
    view_model.roles = roles;
    view_model.logged_in_user = logged_in_user;

    let handlebars = &state.handlebars;

    let html = handlebars
        .render("role/role-table", &view_model)
        .expect("there is an issue while loading the admin template");

    Html(html).into_response()
}

#[derive(Serialize)]
pub struct RoleTableViewModel {
    logged_in_user: AdminUser,
    roles: Vec<RoleModel>,
}

impl RoleTableViewModel {
    fn new() -> Self {
        let logged_in_user = AdminUser::empty_admin_user();
        RoleTableViewModel {
            logged_in_user,
            roles: vec![],
        }
    }
}