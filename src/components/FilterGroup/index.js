import './index.css'

const FilterGroup = props => {
  const renderTypesOfSalaryRange = () => {
    const {salaryRangesList} = props
    return (
      <ul className="list-container">
        {salaryRangesList.map(eachType => {
          const {changePackage} = props
          const onSalary = () => changePackage(eachType.salaryRangeId)
          return (
            <li
              key={eachType.salaryRangeId}
              onClick={onSalary}
              className="list-item"
            >
              <input
                type="radio"
                id={eachType.salaryRangeId}
                name="package"
                value={eachType.label}
              />
              <label htmlFor={eachType.salaryRangeId}>{eachType.label}</label>
            </li>
          )
        })}
      </ul>
    )
  }

  const renderTypesOfEmployments = () => {
    const {employmentTypesList} = props
    return (
      <ul className="list-container">
        {employmentTypesList.map(eachType => {
          const {changeEmployment} = props
          const onEmployment = () => changeEmployment(eachType.employmentTypeId)
          return (
            <li
              key={eachType.employmentTypeId}
              onClick={onEmployment}
              className="list-item"
            >
              <input
                type="checkbox"
                id={eachType.employmentTypeId}
                value={eachType.label}
              />
              <label htmlFor={eachType.employmentTypeId}>
                {eachType.label}
              </label>
            </li>
          )
        })}
      </ul>
    )
  }

  return (
    <div className="filter-group-container">
      <h1 className="filter-heading">Type Of Employment</h1>
      {renderTypesOfEmployments()}
      <h1 className="filter-heading">Salary Range</h1>
      {renderTypesOfSalaryRange()}
    </div>
  )
}

export default FilterGroup
