class CreateCompanies < ActiveRecord::Migration[8.0]
  def change
    create_table :companies do |t|
      t.string :name

      t.timestamps
    end
    add_index :companies, :name, unique: true
  end
end
