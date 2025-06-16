require "active_support/core_ext/integer/time"

Rails.application.configure do
  # Code is not reloaded between requests.
  config.enable_reloading = false

  # Eager load code on boot for better performance.
  config.eager_load = true

  # Full error reports are disabled.
  config.consider_all_requests_local = false

  # Enable caching.
  config.action_controller.perform_caching = true

  # Serve static files from the /public folder (e.g., Vite output).
  config.public_file_server.enabled = ENV["RAILS_SERVE_STATIC_FILES"].present?
  config.public_file_server.headers = {
    "Cache-Control" => "public, max-age=#{1.year.to_i}"
  }

  # Use local storage for ActiveStorage unless deploying to cloud.
  config.active_storage.service = :local

  # Assume SSL is handled by Heroku (or a reverse proxy).
  config.assume_ssl = true
  config.force_ssl = true

  # Logging
  config.log_tags = [:request_id]
  config.logger = ActiveSupport::TaggedLogging.new(Logger.new(STDOUT))
  config.log_level = ENV.fetch("RAILS_LOG_LEVEL", "info")

  # Suppress health check path noise
  config.silence_healthcheck_path = "/up"

  # Ignore deprecation warnings in production
  config.active_support.report_deprecations = false

  # Cache and queue backend
  config.cache_store = :solid_cache_store
  config.active_job.queue_adapter = :solid_queue
  config.solid_queue.connects_to = { database: { writing: :queue } }

  # Action Mailer (update this when you configure SMTP)
  config.action_mailer.default_url_options = { host: "your-app-name.herokuapp.com" }
  # config.action_mailer.smtp_settings = {
  #   address: "smtp.sendgrid.net",
  #   port: 587,
  #   domain: "heroku.com",
  #   user_name: Rails.application.credentials.dig(:smtp, :user_name),
  #   password: Rails.application.credentials.dig(:smtp, :password),
  #   authentication: "plain",
  #   enable_starttls_auto: true
  # }

  # Locale fallbacks
  config.i18n.fallbacks = true

  # Do not dump schema after migrations
  config.active_record.dump_schema_after_migration = false
  config.active_record.attributes_for_inspect = [:id]

  # Optional: uncomment and set allowed hosts if needed
  # config.hosts << "your-app-name.herokuapp.com"
end