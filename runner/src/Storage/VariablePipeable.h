#include "./Variable.h"
#include "./Frame.h"
#include <functional>

namespace Storage
{
  class VariablePipeable : Variable
  {
  public:
    const static char TypeName = 1;
    VariablePipeable(Variable *(*implementation)(Frame *args), bool no_args);
    VariablePipeable(val value);

    const val raw() const;

  private:
    std::function<Variable *(Frame *)> implementation;
    bool no_args;
  };
}